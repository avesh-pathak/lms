"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts"
import {
  TrendingUp, Target, BarChart3, Flame, Trophy, Medal
} from "lucide-react"
import { useProblems } from "./problems-provider"
import { format, parseISO, subDays, eachDayOfInterval, isSameDay } from "date-fns"
import { toSlug, cn } from "@/lib/utils"
import Link from "next/link"
import { DailyGoal } from "./daily-goal"
import { ContinueLearning } from "./continue-learning"
import { SmartRecommendations } from "./smart-recommendations"
import { RevisionQueue } from "./revision-queue"
import { Separator } from "@/components/ui/separator"

export function AnalyticsDashboard() {
  const { topics, problems, loading } = useProblems()

  const pointsMap = { "Easy": 50, "Medium": 100, "Hard": 200 }

  // --- Data Calculations ---
  const stats = useMemo(() => {
    const total = topics.reduce((s, t) => s + t.total, 0)
    const solved = topics.reduce((s, t) => s + t.solved, 0)
    const percent = total > 0 ? (solved / total) * 100 : 0

    const byDiff = (level: string) => ({
      done: problems.filter(p => p.difficulty === level && p.status === "Completed").length,
      total: problems.filter(p => p.difficulty === level).length,
    })

    const easy = byDiff("Easy")
    const medium = byDiff("Medium")
    const hard = byDiff("Hard")

    const totalXP = problems
      .filter(p => p.status === "Completed")
      .reduce((acc, p) => acc + (pointsMap[p.difficulty as keyof typeof pointsMap] || 50), 0)

    return { total, solved, percent, easy, medium, hard, totalXP }
  }, [topics, problems])

  const trendData = useMemo(() => {
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    })

    return last30Days.map(date => {
      const dateStr = format(date, "MMM d")
      const count = problems.filter(p =>
        p.status === "Completed" &&
        p.completedAt &&
        isSameDay(parseISO(p.completedAt), date)
      ).length

      const xp = problems
        .filter(p => p.status === "Completed" && p.completedAt && isSameDay(parseISO(p.completedAt), date))
        .reduce((acc, p) => acc + (pointsMap[p.difficulty as keyof typeof pointsMap] || 50), 0)

      return { date: dateStr, count, xp }
    })
  }, [problems])

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

  const streak = useMemo(() => {
    if (problems.length === 0) return 0
    const completedDates = problems
      .filter(p => p.status === "Completed" && p.completedAt)
      .map(p => format(parseISO(p.completedAt!), "yyyy-MM-dd"))
    const uniqueDates = Array.from(new Set(completedDates)).sort((a, b) => b.localeCompare(a))
    if (uniqueDates.length === 0) return 0
    let currentStreak = 0
    const today = format(new Date(), "yyyy-MM-dd")
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")
    let checkDate = uniqueDates[0] === today ? today : (uniqueDates[0] === yesterday ? yesterday : null)
    if (!checkDate) return 0
    let dateIterator = parseISO(checkDate)
    for (const dateStr of uniqueDates) {
      if (dateStr === format(dateIterator, "yyyy-MM-dd")) {
        currentStreak++
        dateIterator = subDays(dateIterator, 1)
      } else { break }
    }
    return currentStreak
  }, [problems])

  const completedToday = useMemo(() => {
    const today = new Date()
    return problems.filter(p =>
      p.status === "Completed" &&
      p.completedAt &&
      isSameDay(parseISO(p.completedAt), today)
    ).length
  }, [problems])

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




  if (loading) return <div className="p-8 text-center text-muted-foreground">Initializing analytics...</div>

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
              </CardHeader>
              <CardContent className="h-[350px]">
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
