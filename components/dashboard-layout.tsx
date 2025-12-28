"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { DashboardOverview } from "./dashboard-overview"
import { TopicDetail } from "./topic-detail"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { getSessionData } from "@/lib/local-storage"
import type { MongoDBProblem, Topic } from "@/lib/types"

interface ExtendedProblem extends MongoDBProblem {
  timeSpent?: number
  notes?: string
  solution?: string
  approach?: string
  tags?: string[]
  confidence?: number
}

export function DashboardLayout() {
  // ---------------- STATE ----------------
  const [topics, setTopics] = useState<Topic[]>([])
  const [problems, setProblems] = useState<ExtendedProblem[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [view, setView] = useState<"overview" | "analytics">("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/problems")
        if (!res.ok) throw new Error("Failed to fetch problems")

        const data = await res.json()

        // ✅ topics directly from API
        setTopics(data.topics ?? [])

        // ---------- merge localStorage ----------
        const localRaw =
          typeof window !== "undefined"
            ? localStorage.getItem("dsa_problems_local")
            : null

        const localData: Record<string, Partial<ExtendedProblem>> =
          localRaw ? JSON.parse(localRaw) : {}

        const mergedProblems: ExtendedProblem[] = (data.problems ?? []).map(
          (p: MongoDBProblem) => ({
            ...p,
            id: p._id,
            ...localData[p._id],
          })
        )

        setProblems(mergedProblems)
        setError(null)
      } catch (err) {
        console.error(err)
        setError("Failed to load problems from database")
      } finally {
        setLoading(false)
      }
    }

    load()

    // restore session
    const session = getSessionData()
    if (session.lastVisitedTopic) setSelectedTopic(session.lastVisitedTopic)
    if (session.view) setView(session.view)
  }, [])

  // ---------------- PERSIST LOCAL STATE ----------------
  useEffect(() => {
    const localData: Record<string, Partial<ExtendedProblem>> = {}

    problems.forEach((p) => {
      localData[p._id] = {
        timeSpent: p.timeSpent,
        notes: p.notes,
        solution: p.solution,
        approach: p.approach,
        tags: p.tags,
        confidence: p.confidence,
        status: p.status,
        starred: p.starred,
      }
    })

    localStorage.setItem("dsa_problems_local", JSON.stringify(localData))
  }, [problems])

  // ---------------- LOADING / ERROR ----------------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading dashboard…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-destructive">
        {error}
      </div>
    )
  }

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-background">
      {/* ✅ SIDEBAR (NO PROPS) */}
      <DashboardSidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        {selectedTopic ? (
          <TopicDetail topicSlug={selectedTopic} />
        ) : view === "analytics" ? (
          <AnalyticsDashboard topics={topics} problems={problems} />
        ) : (
          <DashboardOverview topics={topics} onSelectTopic={setSelectedTopic} />
        )}
      </main>
    </div>
  )
}
