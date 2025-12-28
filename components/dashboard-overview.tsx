"use client"

import { useMemo, useState } from "react"
import { toSlug, cn } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SearchFilterBar, type FilterState } from "./search-filter-bar"
import { format, isSameDay, parseISO } from "date-fns"
import { Search, Trophy, Medal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "./ui/separator"
import { Button } from "@/components/ui/button"
import { useProblems } from "./problems-provider"

export function DashboardOverview() {
  const { topics, problems, loading } = useProblems()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    difficulties: new Set(),
    statuses: new Set(),
    companies: new Set(),
  })

  // Calculate Today's Completion
  const completedToday = useMemo(() => {
    const today = new Date()
    return problems.filter(p =>
      p.status === "Completed" &&
      p.completedAt &&
      isSameDay(parseISO(p.completedAt), today)
    ).length
  }, [problems])

  const filteredTopics = useMemo(() => {
    if (!searchTerm) return topics
    return topics.filter((t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [topics, searchTerm])

  const stats = useMemo(() => {
    const total = topics.reduce((acc, t) => acc + t.total, 0)
    const solved = topics.reduce((acc, t) => acc + t.solved, 0)
    return {
      total,
      solved,
      percent: total > 0 ? (solved / total) * 100 : 0,
    }
  }, [topics])

  const getMasteryRank = (percent: number) => {
    if (percent === 100) return { label: "Gold", color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20" }
    if (percent >= 50) return { label: "Silver", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" }
    if (percent >= 25) return { label: "Bronze", color: "text-orange-600 bg-orange-500/10 border-orange-500/20" }
    return null
  }

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  return (
    <div className="p-6 lg:p-8 space-y-12 max-w-7xl mx-auto">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight uppercase">Main Dashboard</h1>
          <p className="text-muted-foreground font-medium">
            Keep pushing! You've solved <span className="text-foreground font-bold">{stats.solved}</span> problems.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-3xl border border-border shadow-sm">
          <div className="space-y-0.5 text-right">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Course Completion</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{stats.percent.toFixed(0)}%</span>
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground/20 rounded-full" style={{ width: `${stats.percent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="space-y-16">
        {/* DSA Patterns */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black uppercase tracking-tight">DSA Patterns</h3>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patterns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/30 h-11 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
                id="problem-search"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => {
              const progress = (topic.solved / topic.total) * 100
              const rank = getMasteryRank(progress)
              return (
                <Link
                  key={topic.id}
                  href={`/dashboard/topic/${toSlug(topic.name)}`}
                  className="group p-5 border rounded-2xl bg-card hover:border-primary/50 hover:shadow-xl transition-all space-y-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 -mr-10 -mt-10 rounded-full group-hover:bg-primary/10 transition-all duration-500" />

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black group-hover:text-primary transition-colors leading-tight truncate max-w-[150px]">{topic.name}</h4>
                        {rank && (
                          <Badge className={cn("text-[8px] h-4 py-0 uppercase font-bold", rank.color, "shrink-0")}>
                            <Medal className="h-2.5 w-2.5" />
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">{topic.solved} / {topic.total} solved</span>
                    </div>
                    <Badge variant={topic.solved === topic.total ? "default" : "outline"} className="font-bold border-muted-foreground/20 h-5 px-1.5 text-[8px] shrink-0">
                      {topic.solved === topic.total ? "DONE" : "ING"}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-black opacity-50 uppercase tracking-tighter">
                      <span>Mastery</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-muted rounded-full" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
