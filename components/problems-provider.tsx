"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { MongoDBProblem, Topic } from "@/lib/types"
import { getProblemData } from "@/lib/local-storage"
import { toSlug, cn } from "@/lib/utils"
import { addDays, isPast, parseISO } from "date-fns"

interface ProblemsContextType {
    problems: MongoDBProblem[]
    topics: Topic[]
    loading: boolean
    refresh: () => Promise<void>
    updateProblem: (id: string, updates: Partial<MongoDBProblem>) => void
}

const ProblemsContext = createContext<ProblemsContextType | undefined>(undefined)

// Helper function to extract title from problem link
const extractTitleFromLink = (problemLink: string): string => {
    try {
        const parts = problemLink.split("/").filter(Boolean)
        const last = parts[parts.length - 1]
        return last.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    } catch (e) {
        return "Untitled Problem"
    }
}

import { DOMAIN_PROBLEMS } from "@/lib/data/domain-data"

export function ProblemsProvider({
    children,
    initialProblems = []
}: {
    children: React.ReactNode,
    initialProblems?: MongoDBProblem[]
}) {
    const [problems, setProblems] = useState<MongoDBProblem[]>(initialProblems)
    const [loading, setLoading] = useState(initialProblems.length === 0)

    // Derive topics from the problems state to stay reactive
    const topics = React.useMemo(() => {
        const topicMap = new Map<string, Topic>()

        // Subject mapping for Core Engineering
        const getSubjectForTopic = (topicName: string): string | undefined => {
            const name = topicName.toLowerCase()
            if (["scalability", "distributed systems", "api design", "message queues", "caching", "load balancing"].some(t => name.includes(t))) return "System Design"
            if (["ood patterns", "design patterns", "creational patterns", "structural patterns", "behavioral patterns"].some(t => name.includes(t))) return "Low Level Design"
            if (name.includes("operating systems") || name.includes("os fundamentals")) return "Operating Systems"
            if (name.includes("computer networks") || name.includes("tcp") || name.includes("http")) return "Computer Networks"
            if (name.includes("dbms") || name.includes("database") || name.includes("sql") || name.includes("nosql")) return "DBMS"
            if (["neural networks", "supervised learning", "genai", "machine learning", "deep learning", "nlp"].some(t => name.includes(t))) return "AI/ML"
            return undefined
        }

        problems.forEach(p => {
            const topicId = toSlug(p.topic)
            const domain = p.domain || "DSA" // Default to DSA

            if (!topicMap.has(topicId)) {
                topicMap.set(topicId, {
                    id: topicId,
                    name: p.topic,
                    solved: 0,
                    total: 0,
                    domain: domain as any,
                    subject: getSubjectForTopic(p.topic),
                    reviewCount: 0
                })
            }
            const t = topicMap.get(topicId)!
            t.total++
            if (p.status === "Completed") t.solved++
            if (p.isReviewDue) t.reviewCount = (t.reviewCount || 0) + 1
        })
        return Array.from(topicMap.values())
    }, [problems])

    const applySRS = (p: MongoDBProblem): MongoDBProblem => {
        const merged = { ...p }
        // --- SRS Logic ---
        if (merged.status === "Completed" && merged.completedAt) {
            const completedDate = parseISO(merged.completedAt)
            // Review due in 3 days for the first revision after completion
            const reviewDueAt = addDays(completedDate, 3).toISOString()
            merged.reviewDueAt = reviewDueAt
            merged.isReviewDue = isPast(parseISO(reviewDueAt)) || (merged.tags?.includes("Revision") ?? false)
        } else if (merged.tags?.includes("Revision")) {
            // Manually tagged for revision
            merged.isReviewDue = true
        } else {
            // Reset if tag removed or not completed
            merged.isReviewDue = false
        }
        return merged
    }

    const mergeProblem = (p: MongoDBProblem) => {
        const stored = getProblemData(p._id)
        let title = p.title
        if (title === "None" && p.problem_link) {
            title = extractTitleFromLink(p.problem_link)
        }
        // Ensure p.domain is set or defaulted
        const domain = p.domain || "DSA"

        const merged: MongoDBProblem = stored ? { ...p, ...stored, title, domain } : { ...p, title, domain }
        return applySRS(merged)
    }

    const mergeWithDomainData = (apiProblems: MongoDBProblem[]) => {
        const mergedApi = apiProblems.map(mergeProblem)
        const allProblems = [...mergedApi]
        DOMAIN_PROBLEMS.forEach(dp => {
            if (!allProblems.find(p => p._id === dp._id)) {
                allProblems.push(mergeProblem(dp))
            }
        })
        return allProblems
    }

    const fetchData = async () => {
        try {
            const res = await fetch("/api/problems")
            const data = await res.json()
            setProblems(mergeWithDomainData(data.problems ?? []))
        } catch (err) {
            console.error("Failed to load problems in provider", err)
        } finally {
            setLoading(false)
        }
    }

    const updateProblem = React.useCallback((id: string, updates: Partial<MongoDBProblem>) => {
        setProblems(prev => prev.map(p => {
            if (p._id === id) {
                const updated = { ...p, ...updates }
                // Re-apply SRS logic to the updated problem for immediate reactivity
                return applySRS(updated)
            }
            return p
        }))
    }, [])

    useEffect(() => {
        if (initialProblems.length > 0) {
            setProblems(mergeWithDomainData(initialProblems))
            setLoading(false)
        } else {
            fetchData()
        }
    }, [])

    return (
        <ProblemsContext.Provider value={{ problems, topics, loading, refresh: fetchData, updateProblem }}>
            {children}
        </ProblemsContext.Provider>
    )
}

export function useProblems() {
    const context = useContext(ProblemsContext)
    if (context === undefined) {
        throw new Error("useProblems must be used within a ProblemsProvider")
    }
    return context
}
