"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { MongoDBProblem, Topic } from "@/lib/types"
import { getProblemData } from "@/lib/local-storage"
import { toSlug } from "@/lib/utils"

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
        problems.forEach(p => {
            const topicId = toSlug(p.topic)
            if (!topicMap.has(topicId)) {
                topicMap.set(topicId, {
                    id: topicId,
                    name: p.topic,
                    solved: 0,
                    total: 0
                })
            }
            const t = topicMap.get(topicId)!
            t.total++
            if (p.status === "Completed") t.solved++
        })
        return Array.from(topicMap.values())
    }, [problems])

    const mergeProblem = (p: MongoDBProblem) => {
        const stored = getProblemData(p._id)
        let title = p.title
        if (title === "None" && p.problem_link) {
            title = extractTitleFromLink(p.problem_link)
        }
        return stored ? { ...p, ...stored, title } : { ...p, title }
    }

    const fetchData = async () => {
        try {
            const res = await fetch("/api/problems")
            const data = await res.json()
            const mergedProblems = (data.problems ?? []).map(mergeProblem)
            setProblems(mergedProblems)
        } catch (err) {
            console.error("Failed to load problems in provider", err)
        } finally {
            setLoading(false)
        }
    }

    const updateProblem = React.useCallback((id: string, updates: Partial<MongoDBProblem>) => {
        setProblems(prev => prev.map(p => p._id === id ? { ...p, ...updates } : p))
    }, [])

    useEffect(() => {
        if (initialProblems.length > 0) {
            setProblems(initialProblems.map(mergeProblem))
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
