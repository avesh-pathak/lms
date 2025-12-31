"use client"

import { useMemo } from "react"
import { toSlug, cn } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProblems } from "./problems-provider"
import { Topic } from "@/lib/types"

import { useSearchParams, useRouter } from "next/navigation"

export function DashboardOverview() {
  const { topics, problems, loading } = useProblems()
  const searchParams = useSearchParams()
  const router = useRouter()


  const activeDomain = searchParams.get("domain") || "DSA"

  const setActiveDomain = (domain: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("domain", domain)
    router.push(`/dashboard?${params.toString()}`, { scroll: false })
  }

  const stats = useMemo(() => {
    const domainTopics = topics.filter(t => t.domain === activeDomain)
    const total = domainTopics.reduce((acc, t) => acc + t.total, 0)
    const solved = domainTopics.reduce((acc, t) => acc + t.solved, 0)
    return {
      total,
      solved,
      percent: total > 0 ? (solved / total) * 100 : 0,
    }
  }, [topics, activeDomain])

  const domains = useMemo(() => {
    const d = new Set<string>()
    topics.forEach(t => {
      if (t.domain) d.add(t.domain)
    })
    const domainList = Array.from(d)
    if (domainList.includes("DSA")) {
      return ["DSA", ...domainList.filter(item => item !== "DSA")]
    }
    return domainList
  }, [topics])

  const filteredTopics = useMemo(() => {
    return topics.filter((t: Topic) => {
      return t.domain === activeDomain
    })
  }, [topics, activeDomain])

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic text-primary">
              Babua Hub
            </h1>
          </div>
          <p className="text-muted-foreground font-medium text-xl max-w-2xl">
            Clean, focused engineering growth. No clutter, just <span className="text-primary font-black decoration-primary/30 underline underline-offset-8">Progress</span>
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-500 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center gap-6 bg-card p-6 rounded-[32px] border border-border shadow-2xl">
            <div className="space-y-1 text-right">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{activeDomain} Mastery</span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black tabular-nums">{stats.percent.toFixed(0)}%</span>
                <div className="flex flex-col gap-1">
                  <div className="h-3 w-40 bg-muted rounded-full overflow-hidden border border-muted-foreground/10">
                    <div className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full shadow-[0_0_15px_rgba(251,146,60,0.6)] animate-pulse" style={{ width: `${stats.percent}%` }} />
                  </div>
                  <span className="text-[9px] font-black uppercase text-primary/60 tracking-tighter self-end">{stats.solved} / {stats.total} Solved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {/* Main Content Area */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {/* Upcoming Sessions removed */}

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-2 p-1.5 bg-muted/40 rounded-full border border-border/50 overflow-x-auto scrollbar-hide">
                {domains.map(d => (
                  <Button
                    key={d}
                    variant={activeDomain === d ? "default" : "ghost"}
                    onClick={() => setActiveDomain(d)}
                    className={cn(
                      "rounded-full font-black uppercase text-[10px] px-8 h-10 transition-all shrink-0",
                      activeDomain === d
                        ? "shadow-lg shadow-primary/25 bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-muted font-bold"
                    )}
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic: Topic) => {
                const progress = (topic.solved / topic.total) * 100
                const rank = getMasteryRank(progress)
                return (
                  <Link
                    key={topic.id}
                    href={`/dashboard/topic/${toSlug(topic.name)}`}
                    className="group p-5 border rounded-[24px] bg-card hover:border-primary/50 hover:shadow-xl transition-all space-y-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full group-hover:bg-primary/10 transition-all duration-500" />

                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-black group-hover:text-primary transition-colors leading-tight italic truncate max-w-[150px] uppercase">
                            {topic.name}
                          </h4>
                          {rank && (
                            <Badge className={cn("text-[8px] h-4 py-0 uppercase font-black", rank.color, "shrink-0 shadow-sm")}>
                              {rank.label}
                            </Badge>
                          )}
                          {(topic.reviewCount || 0) > 0 && (
                            <Badge className="text-[8px] h-4 py-0 uppercase font-black bg-red-500/10 text-red-500 border-red-500/20 animate-bounce">
                              Revise Now
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase opacity-60">
                          {topic.solved} / {topic.total} Completed
                        </p>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="opacity-40">Proficiency</span>
                        <span className="text-primary font-black">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(251,146,60,0.4)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                )
              })}
              {filteredTopics.length === 0 && (
                <div className="col-span-full py-12 text-center space-y-4 bg-muted/5 rounded-[32px] border border-dashed border-primary/20">
                  <div className="text-4xl">🔍</div>
                  <div className="space-y-1">
                    <h4 className="font-black uppercase tracking-tighter">No topics found</h4>
                    <p className="text-xs font-medium text-muted-foreground">Try adjusting your search or switching domains.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
