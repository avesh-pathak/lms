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

    // Derive topics from the problems state to stay reactive (Optimized)
    const topics = React.useMemo(() => {
        const topicMap = new Map<string, Topic>()

        // Optimize keyword matching by pre-defining maps
        const subjectKeywords = [
            { keywords: ["scalability", "distributed systems", "api design", "message queues", "caching", "load balancing"], subject: "System Design" },
            { keywords: ["ood patterns", "design patterns", "creational patterns", "structural patterns", "behavioral patterns"], subject: "Low Level Design" },
            { keywords: ["operating systems", "os fundamentals"], subject: "Operating Systems" },
            { keywords: ["computer networks", "tcp", "http"], subject: "Computer Networks" },
            { keywords: ["dbms", "database", "sql", "nosql"], subject: "DBMS" },
            { keywords: ["neural networks", "supervised learning", "genai", "machine learning", "deep learning", "nlp"], subject: "AI/ML" },
        ]

        const getSubjectForTopic = (pTopic: string): string | undefined => {
            const name = pTopic.toLowerCase()
            for (const item of subjectKeywords) {
                if (item.keywords.some(k => name.includes(k))) return item.subject
            }
            return undefined
        }

        for (const p of problems) {
            const topicId = toSlug(p.topic)
            const domain = p.domain || "DSA"

            let t = topicMap.get(topicId)
            if (!t) {
                t = {
                    id: topicId,
                    name: p.topic,
                    solved: 0,
                    total: 0,
                    domain: domain as any,
                    subject: getSubjectForTopic(p.topic),
                    reviewCount: 0
                }
                topicMap.set(topicId, t)
            }
            t.total++
            if (p.status === "Completed") t.solved++
            if (p.isReviewDue) t.reviewCount = (t.reviewCount || 0) + 1
        }
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

    const processAllProblems = (apiProblems: MongoDBProblem[]) => {
        const allProblemsMap = new Map<string, MongoDBProblem>();

        apiProblems.forEach(p => {
            allProblemsMap.set(p._id, mergeProblem(p));
        });

        DOMAIN_PROBLEMS.forEach(dp => {
            if (!allProblemsMap.has(dp._id)) {
                allProblemsMap.set(dp._id, mergeProblem(dp));
            }
        });

        return Array.from(allProblemsMap.values());
    }

    const fetchData = async () => {
        try {
            const res = await fetch("/api/problems")
            const data = await res.json()
            setProblems(processAllProblems(data.problems ?? []))
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
            setProblems(processAllProblems(initialProblems))
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
