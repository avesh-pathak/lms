"use client"

import React, { useEffect, useMemo, useState } from "react"
import type { MongoDBProblem } from "@/lib/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Check, Circle, Star, ExternalLink, ChevronDown, ChevronRight, Shuffle } from "lucide-react"
import { SearchFilterBar, type FilterState } from "./search-filter-bar"
import { getProblemData, updateProblemData } from "@/lib/local-storage"

import { useProblems } from "./problems-provider"
import { toSlug, cn } from "@/lib/utils"
import { ProblemTimer } from "./problem-timer"
import { ProblemNotes } from "./problem-notes"
import { TagManager } from "./tag-manager"
import { toast } from "sonner"

function slugToTitle(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

type TopicDetailProps = {
  topicSlug: string
}

export function TopicDetail({ topicSlug }: TopicDetailProps) {
  const { problems: allProblems, loading, updateProblem } = useProblems()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    difficulties: new Set(),
    statuses: new Set(),
    companies: new Set(),
  })

  /* ---------------- FILTER BY TOPIC ---------------- */
  const topicProblems = useMemo(() => {
    return allProblems.filter(
      (p) => p.topic && toSlug(p.topic) === topicSlug
    )
  }, [allProblems, topicSlug])

  const completed = topicProblems.filter(
    (p) => p.status === "Completed"
  ).length

  const total = topicProblems.length
  const progress = total > 0 ? (completed / total) * 100 : 0

  /* ---------------- SEARCH + FILTER ---------------- */
  const filteredProblems = useMemo(() => {
    return topicProblems.filter((problem) => {
      if (
        searchTerm &&
        !problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      if (
        filters.difficulties.size > 0 &&
        !filters.difficulties.has(problem.difficulty)
      ) {
        return false
      }

      if (
        filters.statuses.size > 0 &&
        !filters.statuses.has(problem.status)
      ) {
        return false
      }

      return true
    })
  }, [topicProblems, searchTerm, filters])

  /* ---------------- ACTIONS ---------------- */
  const toggleStatus = React.useCallback((id: string) => {
    const problem = allProblems.find(p => p._id === id)
    if (!problem) return
    const newStatus = problem.status === "Completed" ? "Pending" : "Completed"

    // Weighted Points
    const pointsMap = { "Easy": 50, "Medium": 100, "Hard": 200 }
    const points = pointsMap[problem.difficulty as keyof typeof pointsMap] || 50

    if (newStatus === "Completed") {
      toast.success(`Problem Solved!`, {
        description: `You earned ${points} XP. Great job!`,
        icon: <div className="p-1 bg-green-500 rounded-full text-white"><Check className="h-3 w-3" /></div>,
      })
    }

    updateProblemData(id, { status: newStatus })
    updateProblem(id, { status: newStatus })
  }, [allProblems, updateProblem])

  const toggleStar = React.useCallback((id: string) => {
    const problem = allProblems.find(p => p._id === id)
    if (!problem) return
    const newStarred = !problem.starred
    updateProblemData(id, { starred: newStarred })
    updateProblem(id, { starred: newStarred })
  }, [allProblems, updateProblem])

  const handleNotesSave = React.useCallback((id: string, data: { notes: string; solution: string; approach: string }) => {
    updateProblemData(id, data)
    updateProblem(id, data)
  }, [updateProblem])

  const handleTimeUpdate = React.useCallback((id: string, time: number) => {
    updateProblemData(id, { timeSpent: time })
    updateProblem(id, { timeSpent: time })
  }, [updateProblem])

  const handleTagsChange = React.useCallback((id: string, tags: string[]) => {
    updateProblemData(id, { tags })
    updateProblem(id, { tags })
  }, [updateProblem])

  const pickRandomProblem = React.useCallback(() => {
    const pending = topicProblems.filter(p => p.status !== "Completed")
    const targets = pending.length > 0 ? pending : topicProblems
    if (targets.length === 0) return

    const random = targets[Math.floor(Math.random() * targets.length)]
    setExpandedId(random._id)

    // Scroll to the element
    setTimeout(() => {
      const el = document.getElementById(`problem-${random._id}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [topicProblems])

  // Get all unique tags from problems for the manager
  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>(["Revision", "Important", "Tricky", "Optimize"])
    allProblems.forEach(p => {
      p.tags?.forEach(t => tagSet.add(t))
    })
    return Array.from(tagSet)
  }, [allProblems])

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading problems…</div>
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight uppercase">
            {slugToTitle(topicSlug)}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {completed} of {total} problems solved ({progress.toFixed(0)}%)
          </p>
          <Progress value={progress} className="h-2 w-[300px]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={setFilters}
        />
        <Button
          variant="outline"
          className="gap-2 shrink-0 h-10 px-4 border-dashed hover:border-primary hover:text-primary transition-all"
          onClick={pickRandomProblem}
        >
          <Shuffle className="h-4 w-4" />
          Pick Random
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 px-2"></TableHead>
              <TableHead className="w-10 px-2 font-bold uppercase tracking-wider text-[10px]">#</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px]">Problem</TableHead>
              <TableHead className="w-24 font-bold uppercase tracking-wider text-[10px]">Difficulty</TableHead>
              <TableHead className="w-32 font-bold uppercase tracking-wider text-[10px]">Timer</TableHead>
              <TableHead className="w-24 font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
              <TableHead className="w-24 text-right font-bold uppercase tracking-wider text-[10px]">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProblems.map((problem, index) => (
              <React.Fragment key={problem._id}>
                <TableRow
                  id={`problem-${problem._id}`}
                  className={cn(
                    "group transition-colors cursor-pointer",
                    expandedId === problem._id && "bg-muted/50"
                  )}
                  onClick={() => setExpandedId(expandedId === problem._id ? null : problem._id)}
                >
                  <TableCell className="align-top py-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedId(expandedId === problem._id ? null : problem._id)
                      }}
                    >
                      {expandedId === problem._id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-muted-foreground px-2 align-top py-4">{index + 1}</TableCell>

                  <TableCell className="whitespace-normal py-4 min-w-[300px] align-top">
                    <div className="flex items-start gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStar(problem._id)
                        }}
                        className="transition-transform active:scale-125 pt-0.5"
                      >
                        <Star
                          className={cn(
                            "h-4 w-4 transition-colors",
                            problem.starred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground group-hover:text-muted-foreground/80"
                          )}
                        />
                      </button>

                      <span className="text-base font-bold leading-tight break-words flex-1 group-hover/row:text-primary transition-colors">{problem.title}</span>

                      <a
                        href={problem.problem_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors pt-0.5 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </TableCell>

                  <TableCell className="align-top py-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "font-bold uppercase text-[10px] h-5",
                        problem.difficulty === "Easy" && "bg-green-500/10 text-green-500 hover:bg-green-500/20",
                        problem.difficulty === "Medium" && "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
                        problem.difficulty === "Hard" && "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      )}
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>

                  <TableCell className="align-top py-4" onClick={(e) => e.stopPropagation()}>
                    <ProblemTimer
                      problemId={problem._id}
                      onTimeUpdate={handleTimeUpdate}
                    />
                  </TableCell>

                  <TableCell className="align-top py-4">
                    <div className="flex items-center gap-2">
                      {problem.status === "Completed" ? (
                        <div className="flex items-center gap-1.5 text-success">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-bold uppercase tracking-tight">Solved</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Circle className="h-4 w-4" />
                          <span className="text-sm font-bold uppercase tracking-tight">Pending</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right align-top py-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant={problem.status === "Completed" ? "outline" : "default"}
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStatus(problem._id)
                      }}
                    >
                      {problem.status === "Completed" ? "Undo" : "Done"}
                    </Button>
                  </TableCell>
                </TableRow>

                {expandedId === problem._id && (
                  <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-0">
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 md:p-6 bg-card border-x border-b rounded-b-xl mx-4 mb-4 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200 space-y-6">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</label>
                          <TagManager
                            availableTags={allAvailableTags}
                            selectedTags={problem.tags || []}
                            onTagsChange={(tags) => handleTagsChange(problem._id, tags)}
                            onCreateTag={(tag) => handleTagsChange(problem._id, [...(problem.tags || []), tag])}
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Problem Details</label>
                          <ProblemNotes
                            problemId={problem._id}
                            initialNotes={problem.notes || ""}
                            initialSolution={problem.solution || ""}
                            initialApproach={problem.approach || ""}
                            onSave={handleNotesSave}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}

            {filteredProblems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p>No problems found in this topic matching your search</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
