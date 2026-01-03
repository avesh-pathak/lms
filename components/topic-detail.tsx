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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Check, Circle, Star, ExternalLink, ChevronDown, ChevronRight, Shuffle, BookOpen, List, Video } from "lucide-react"
import { SearchFilterBar, type FilterState } from "./search-filter-bar"
import { getProblemData, updateProblemData } from "@/lib/local-storage"

import { useProblems } from "./problems-provider"
import { toSlug, cn } from "@/lib/utils"
import { ProblemTimer } from "./problem-timer"
import { ProblemNotes } from "./problem-notes"
import { TagManager } from "./tag-manager"
import { toast } from "sonner"
import { TheoryContent } from "./theory-content"
import type { TopicTheory } from "@/lib/theory"

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
  const [activeTab, setActiveTab] = useState("problems")
  const [theory, setTheory] = useState<TopicTheory | null>(null)
  const [allTheories, setAllTheories] = useState<TopicTheory[]>([])
  const [loadingTheory, setLoadingTheory] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    difficulties: new Set(),
    statuses: new Set(),
    companies: new Set(),
  })

  // Fetch theory when tab changes to theory
  useEffect(() => {
    if (activeTab === "theory" && !theory) {
      setLoadingTheory(true)
      fetch(`/api/theory/${topicSlug}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setTheory(data)
        })
        .catch(err => console.error("Theory fetch error:", err))
        .finally(() => setLoadingTheory(false))
    }
  }, [activeTab, topicSlug, theory])

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

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight uppercase italic text-foreground">
            {slugToTitle(topicSlug)}
          </h2>
          {loading ? (
            <div className="h-4 w-48 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-sm text-muted-foreground font-medium">
              {completed} of {total} problems solved ({progress.toFixed(0)}%)
            </p>
          )}
          <Progress value={progress} className="h-2 w-[300px]" />
        </div>
      </div>

      <Tabs value={activeTab} defaultValue="problems" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8 bg-muted/50 p-1 border border-border/50 rounded-xl">
          <TabsTrigger value="problems" className="flex items-center gap-2 font-bold uppercase tracking-tighter italic data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <List className="h-4 w-4" />
            Problems
          </TabsTrigger>
          <TabsTrigger value="theory" className="flex items-center gap-2 font-bold uppercase tracking-tighter italic data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <BookOpen className="h-4 w-4" />
            Theory
          </TabsTrigger>
        </TabsList>
        <TabsContent value="problems" className="space-y-6 mt-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <SearchFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFilterChange={setFilters}
            />
            <Button
              variant="outline"
              className="gap-2 shrink-0 h-10 px-4 border-dashed hover:border-primary hover:text-primary transition-all font-bold uppercase tracking-tighter italic"
              onClick={pickRandomProblem}
              disabled={loading}
            >
              <Shuffle className="h-4 w-4" />
              Pick Random
            </Button>
          </div>

          <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="w-10 px-2"></TableHead>
                  <TableHead className="w-10 px-2 font-black uppercase tracking-wider text-[10px] text-foreground/70">#</TableHead>
                  <TableHead className="font-black uppercase tracking-wider text-[10px] text-foreground/70">Problem</TableHead>
                  <TableHead className="w-24 font-black uppercase tracking-wider text-[10px] text-foreground/70">Difficulty</TableHead>
                  <TableHead className="w-32 font-black uppercase tracking-wider text-[10px] text-foreground/70">Timer</TableHead>
                  <TableHead className="w-24 font-black uppercase tracking-wider text-[10px] text-foreground/70">Status</TableHead>
                  <TableHead className="w-24 text-right font-black uppercase tracking-wider text-[10px] text-foreground/70">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell colSpan={7} className="p-8">
                        <div className="h-6 bg-muted/40 rounded-lg w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <>
                    {filteredProblems.map((problem, index) => (
                      <ProblemRow
                        key={problem._id}
                        problem={problem}
                        index={index}
                        isExpanded={expandedId === problem._id}
                        onExpand={() => setExpandedId(expandedId === problem._id ? null : problem._id)}
                        toggleStatus={toggleStatus}
                        toggleStar={toggleStar}
                        handleTimeUpdate={handleTimeUpdate}
                        handleTagsChange={handleTagsChange}
                        handleNotesSave={handleNotesSave}
                        allAvailableTags={allAvailableTags}
                      />
                    ))}


                    {filteredProblems.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-20 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <p className="font-bold uppercase tracking-tighter italic">No problems found</p>
                            <p className="text-xs opacity-60">Try adjusting your filters or search term</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="theory" className="mt-0 min-h-[400px]">
          {loadingTheory ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-black uppercase tracking-widest italic animate-pulse">Analyzing Theory...</p>
            </div>
          ) : theory ? (
            <TheoryContent
              theory={theory}
              allTheories={allTheories}
              onPracticeClick={() => setActiveTab("problems")}
              onDownloadAll={async () => {
                if (allTheories.length === 0) {
                  const res = await fetch('/api/theory')
                  const data = await res.json()
                  if (Array.isArray(data)) {
                    setAllTheories(data)
                  }
                }
                setTimeout(() => window.print(), 500)
              }}
            />
          ) : (
            <div className="space-y-12">
              <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed border-border/50">
                <p className="text-muted-foreground font-bold uppercase tracking-tighter italic text-xl">Theory content coming soon for this module.</p>
                <p className="text-xs text-muted-foreground/60 mt-2 font-medium">We're still distilling the core patterns for {slugToTitle(topicSlug)}.</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

const ProblemRow = React.memo(function ProblemRow({
  problem,
  index,
  isExpanded,
  onExpand,
  toggleStatus,
  toggleStar,
  handleTimeUpdate,
  handleTagsChange,
  handleNotesSave,
  allAvailableTags
}: {
  problem: MongoDBProblem
  index: number
  isExpanded: boolean
  onExpand: () => void
  toggleStatus: (id: string) => void
  toggleStar: (id: string) => void
  handleTimeUpdate: (id: string, time: number) => void
  handleTagsChange: (id: string, tags: string[]) => void
  handleNotesSave: (id: string, data: { notes: string; solution: string; approach: string }) => void
  allAvailableTags: string[]
}) {
  return (
    <React.Fragment>
      <TableRow
        id={`problem-${problem._id}`}
        className={cn(
          "group transition-colors cursor-pointer border-b border-border/50 last:border-0",
          isExpanded && "bg-muted/50"
        )}
        onClick={onExpand}
      >
        <TableCell className="align-top py-4" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onExpand()
            }}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </TableCell>
        <TableCell className="text-muted-foreground px-2 align-top py-4 font-bold">{index + 1}</TableCell>

        <TableCell className="whitespace-normal py-4 min-w-[300px] align-top">
          <div className="flex items-start gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleStar(problem._id)
              }}
              className="transition-transform active:scale-125 pt-0.5"
              aria-label={problem.starred ? "Unstar problem" : "Star problem"}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  problem.starred
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground group-hover:text-muted-foreground/80"
                )}
                aria-hidden="true"
              />
            </button>

            <span className="text-base font-bold leading-tight break-words flex-1 group-hover/row:text-primary transition-colors tracking-tight italic text-foreground">{problem.title}</span>

            <a
              href={problem.problem_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors pt-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Open ${problem.title} on external site`}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </TableCell>

        <TableCell className="align-top py-4">
          <Badge
            variant="secondary"
            className={cn(
              "font-black uppercase text-[10px] h-5 tracking-tighter",
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
              <div className="flex items-center gap-1.5 text-success" aria-label="Status: Solved">
                <Check className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-black uppercase tracking-tight italic">Solved</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-muted-foreground" aria-label="Status: Pending">
                <Circle className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-black uppercase tracking-tight italic">Pending</span>
              </div>
            )}
          </div>
        </TableCell>

        <TableCell className="text-right align-top py-4" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant={problem.status === "Completed" ? "outline" : "default"}
            className="h-8 font-black uppercase tracking-tighter italic"
            onClick={(e) => {
              e.stopPropagation()
              toggleStatus(problem._id)
            }}
          >
            {problem.status === "Completed" ? "Undo" : "Done"}
          </Button>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="bg-muted/30 hover:bg-muted/30 border-t-0">
          <TableCell colSpan={7} className="p-0">
            <div className="p-4 md:p-6 bg-card border-x border-b rounded-b-xl mx-4 mb-4 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Tags</label>
                <TagManager
                  availableTags={allAvailableTags}
                  selectedTags={problem.tags || []}
                  onTagsChange={(tags) => handleTagsChange(problem._id, tags)}
                  onCreateTag={(tag) => handleTagsChange(problem._id, [...(problem.tags || []), tag])}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-wider">Problem Details</label>
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
  )
})
