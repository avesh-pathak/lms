"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts"
import {
  TrendingUp, Target, BarChart3, Flame, Trophy, Medal
} from "lucide-react"
import { useProblems } from "./problems-provider"
import { format, parseISO, subDays, eachDayOfInterval, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { DailyGoal } from "./daily-goal"
import { ContinueLearning } from "./continue-learning"
import { SmartRecommendations } from "./smart-recommendations"
import { RevisionQueue } from "./revision-queue"
import { Separator } from "@/components/ui/separator"

export function AnalyticsDashboard() {
  const { topics, problems, loading } = useProblems()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const pointsMap = { "Easy": 50, "Medium": 100, "Hard": 200 }

  // --- Data Calculations ---
  // --- Consolidated Data Calculations (Optimized to O(N) instead of O(N^2)) ---
  const { stats, trendData, streak, completedToday } = useMemo(() => {
    const total = topics.reduce((s, t) => s + t.total, 0)
    const solved = topics.reduce((s, t) => s + t.solved, 0)
    const percent = total > 0 ? (solved / total) * 100 : 0

    const diffStats = {
      Easy: { done: 0, total: 0 },
      Medium: { done: 0, total: 0 },
      Hard: { done: 0, total: 0 }
    }

    let totalXP = 0
    let completedCountToday = 0
    const today = new Date()
    const todayStr = format(today, "yyyy-MM-dd")
    const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd")

    // Map to group XP by date for trend
    const xpByDate = new Map<string, number>()

    // Set for streak calculation
    const completedDatesSet = new Set<string>()

    problems.forEach(p => {
      const diff = p.difficulty as keyof typeof diffStats
      if (diffStats[diff]) {
        diffStats[diff].total++
        if (p.status === "Completed") {
          diffStats[diff].done++
        }
      }

      if (p.status === "Completed") {
        const xp = pointsMap[p.difficulty as keyof typeof pointsMap] || 50
        totalXP += xp

        if (p.completedAt) {
          const pDate = parseISO(p.completedAt)
          const pDateStr = format(pDate, "yyyy-MM-dd")
          completedDatesSet.add(pDateStr)

          if (isSameDay(pDate, today)) {
            completedCountToday++
          }

          const trendKey = format(pDate, "MMM d")
          xpByDate.set(trendKey, (xpByDate.get(trendKey) || 0) + xp)
        }
      }
    })

    // Generate trend data for last 30 days
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    })
    const trend = last30Days.map(date => ({
      date: format(date, "MMM d"),
      xp: xpByDate.get(format(date, "MMM d")) || 0
    }))

    // Calculate Streak
    const sortedDates = Array.from(completedDatesSet).sort((a, b) => b.localeCompare(a))
    let currentStreak = 0
    if (sortedDates.length > 0) {
      let checkDate = sortedDates[0] === todayStr ? todayStr : (sortedDates[0] === yesterdayStr ? yesterdayStr : null)
      if (checkDate) {
        let dateIterator = parseISO(checkDate)
        for (const dateStr of sortedDates) {
          if (dateStr === format(dateIterator, "yyyy-MM-dd")) {
            currentStreak++
            dateIterator = subDays(dateIterator, 1)
          } else if (dateStr > format(dateIterator, "yyyy-MM-dd")) {
            continue // Skip multiple completions on same day (already unique via Set)
          } else {
            break
          }
        }
      }
    }

    return {
      stats: { total, solved, percent, easy: diffStats.Easy, medium: diffStats.Medium, hard: diffStats.Hard, totalXP },
      trendData: trend,
      streak: currentStreak,
      completedToday: completedCountToday
    }
  }, [topics, problems])

  const topicChartData = useMemo(() => {
    return topics
      .map(t => ({
        name: t.name,
        solved: t.solved,
        total: t.total,
        percent: t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0
      }))
      .filter(t => t.percent < 100)
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 10)
  }, [topics])

  const mostRecentProblem = useMemo(() => {
    const sorted = [...problems]
      .filter(p => p.status !== "Completed" && (p.timeSpent || 0) > 0)
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return dateB - dateA
      })
    return sorted[0] || null
  }, [problems])

  if (!mounted || loading) return <div className="p-8 text-center text-muted-foreground animate-pulse font-black uppercase tracking-widest text-[10px] italic">Initializing analytics terminal...</div>

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8 border-border/50">
        <div className="space-y-1">
          <h2 className="text-5xl font-black tracking-tight text-primary">
            ANALYTICS
          </h2>
          <p className="text-muted-foreground font-medium">Real-time performance decoding.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-card border h-16 px-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <Trophy className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-black leading-none">{completedToday}</span>
              <span className="text-[9px] font-black uppercase opacity-40">Today</span>
            </div>
          </div>
          <div className="bg-card border h-16 px-6 rounded-2xl flex items-center gap-4 shadow-sm">
            <Medal className="h-6 w-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-xl font-black leading-none">{streak}</span>
              <span className="text-[9px] font-black uppercase opacity-40">Streak</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <MetricCard title="Total XP" value={stats.totalXP.toLocaleString()} icon={Trophy} color="primary" />
            <MetricCard title="Overall" value={`${stats.percent.toFixed(0)}%`} icon={TrendingUp} color="primary" />
            <MetricCard title="Easy" value={stats.easy.done} icon={Target} color="green" />
            <MetricCard title="Medium" value={stats.medium.done} icon={BarChart3} color="yellow" />
            <MetricCard title="Hard" value={stats.hard.done} icon={Flame} color="red" />
          </div>

          <div className="space-y-6">
            <Card className="rounded-[32px] border-none bg-muted/20 shadow-none overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">30-Day XP Velocity</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tickCount={5} />
                    <ReTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="xp" name="XP Gained" stroke="#FB923C" strokeWidth={4} fillOpacity={1} fill="url(#colorXP)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-none bg-muted/20 shadow-none overflow-hidden">
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Strongest Patterns</CardTitle>
                <CardDescription className="text-[10px] font-bold italic opacity-60">High-fidelity mastery distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} fontSize={10} axisLine={false} tickLine={false} />
                    <ReTooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="percent" fill="#FB923C" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Focused Daily Pulse */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-[32px] p-6 space-y-6 lg:sticky lg:top-8">
            <div className="space-y-1 px-1">
              <h3 className="text-lg font-black uppercase italic tracking-tight">Daily Pulse.</h3>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">Live feedback loop</p>
            </div>

            <DailyGoal completedToday={completedToday} />

            <Separator className="opacity-10" />

            <div className="space-y-4">
              <ContinueLearning problem={mostRecentProblem} />
            </div>

            <div className="space-y-4">
              <SmartRecommendations />
            </div>

            <RevisionQueue />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    primary: "text-primary border-primary/20",
    green: "text-green-500 border-green-500/20",
    yellow: "text-orange-500 border-orange-500/20",
    red: "text-red-500 border-red-500/20",
  }

  return (
    <div className="bg-card border p-6 rounded-2xl flex flex-col gap-4 shadow-sm group hover:border-primary transition-all">
      <div className={cn("p-2 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white", colorMap[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-black tabular-nums">{value}</span>
        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{title}</span>
      </div>
    </div>
  )
}
