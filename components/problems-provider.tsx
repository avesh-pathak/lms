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
    // Optimized subject lookup (Pre-computed map for O(1) access)
    const subjectCache = React.useMemo(() => new Map<string, string | undefined>(), [])

    const getSubjectForTopic = (pTopic: string): string | undefined => {
        if (subjectCache.has(pTopic)) return subjectCache.get(pTopic)

        const name = pTopic.toLowerCase()
        const subjectKeywords = [
            { keywords: ["scalability", "distributed systems", "api design", "message queues", "caching", "load balancing"], subject: "System Design" },
            { keywords: ["ood patterns", "design patterns", "creational patterns", "structural patterns", "behavioral patterns"], subject: "Low Level Design" },
            { keywords: ["operating systems", "os fundamentals"], subject: "Operating Systems" },
            { keywords: ["computer networks", "tcp", "http"], subject: "Computer Networks" },
            { keywords: ["dbms", "database", "sql", "nosql"], subject: "DBMS" },
            { keywords: ["neural networks", "supervised learning", "genai", "machine learning", "deep learning", "nlp"], subject: "AI/ML" },
        ]

        for (const item of subjectKeywords) {
            if (item.keywords.some(k => name.includes(k))) {
                subjectCache.set(pTopic, item.subject)
                return item.subject
            }
        }
        subjectCache.set(pTopic, undefined)
        return undefined
    }

    const topics = React.useMemo(() => {
        const topicMap = new Map<string, Topic>()

        for (let i = 0; i < problems.length; i++) {
            const p = problems[i]
            const topicId = toSlug(p.topic)

            let t = topicMap.get(topicId)
            if (!t) {
                t = {
                    id: topicId,
                    name: p.topic,
                    solved: 0,
                    total: 0,
                    domain: (p.domain || "DSA") as any,
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

    const applySRS = React.useCallback((p: MongoDBProblem): MongoDBProblem => {
        if (p.status !== "Completed" || !p.completedAt) {
            return { ...p, isReviewDue: !!(p.tags?.includes("Revision")) }
        }

        try {
            const completedDate = parseISO(p.completedAt)
            if (isNaN(completedDate.getTime())) {
                // Invalid date
                return { ...p, isReviewDue: false }
            }
            const reviewDueAt = addDays(completedDate, 3).toISOString()
            const isReviewDue = isPast(parseISO(reviewDueAt)) || (p.tags?.includes("Revision") ?? false)

            return { ...p, reviewDueAt, isReviewDue }
        } catch (e) {
            return { ...p, isReviewDue: false }
        }
    }, [])

    const mergeProblem = React.useCallback((p: MongoDBProblem) => {
        const stored = getProblemData(p._id)
        const domain = p.domain || "DSA"
        let title = p.title
        if (title === "None" && p.problem_link) {
            title = extractTitleFromLink(p.problem_link)
        }

        const merged: MongoDBProblem = { ...p, ...stored, title, domain }
        return applySRS(merged)
    }, [applySRS])

    const processAllProblems = React.useCallback((apiProblems: MongoDBProblem[]) => {
        const allProblemsMap = new Map<string, MongoDBProblem>();

        // Cache DOMAIN_PROBLEMS length for performance
        const dpLen = DOMAIN_PROBLEMS.length
        const apiLen = apiProblems.length

        for (let i = 0; i < apiLen; i++) {
            const p = apiProblems[i]
            allProblemsMap.set(p._id, mergeProblem(p));
        }

        for (let i = 0; i < dpLen; i++) {
            const dp = DOMAIN_PROBLEMS[i]
            if (!allProblemsMap.has(dp._id)) {
                allProblemsMap.set(dp._id, mergeProblem(dp));
            }
        }

        return Array.from(allProblemsMap.values());
    }, [mergeProblem])

    const [isPending, startTransition] = React.useTransition()

    const fetchData = React.useCallback(async () => {
        try {
            const res = await fetch("/api/problems")
            const data = await res.json()
            startTransition(() => {
                setProblems(processAllProblems(data.problems ?? []))
                setLoading(false)
            })
        } catch (err) {
            console.error("Failed to load problems in provider", err)
            setLoading(false)
        }
    }, [processAllProblems])

    const updateProblem = React.useCallback((id: string, updates: Partial<MongoDBProblem>) => {
        startTransition(() => {
            setProblems(prev => {
                const index = prev.findIndex(p => p._id === id)
                if (index === -1) return prev

                const newProblems = [...prev]
                const updated = { ...newProblems[index], ...updates }
                newProblems[index] = applySRS(updated)
                return newProblems
            })
        })
    }, [applySRS])

    // Optimize context value to prevent unnecessary re-renders
    const value = React.useMemo(() => ({
        problems,
        topics,
        loading,
        refresh: fetchData,
        updateProblem
    }), [problems, topics, loading, fetchData, updateProblem])

    useEffect(() => {
        if (initialProblems.length > 0) {
            startTransition(() => {
                setProblems(processAllProblems(initialProblems))
            })
            setLoading(false)
        } else {
            fetchData()
        }
    }, [initialProblems, processAllProblems, fetchData])

    return (
        <ProblemsContext.Provider value={value}>
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
