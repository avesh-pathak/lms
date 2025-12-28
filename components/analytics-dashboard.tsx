"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts"
import {
  TrendingUp, Target, BarChart3, Flame, Clock,
  Search, ArrowUpRight, CheckCircle2, AlertCircle
} from "lucide-react"
import { useProblems } from "./problems-provider"
import { format, parseISO, subDays, eachDayOfInterval, isSameDay } from "date-fns"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toSlug, cn } from "@/lib/utils"
import Link from "next/link"

export function AnalyticsDashboard() {
  const { topics, problems, loading } = useProblems()
  const [topicSearch, setTopicSearch] = useState("")

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

    return { total, solved, percent, easy, medium, hard }
  }, [topics, problems])

  const difficultyData = useMemo(() => [
    { name: "Easy", value: stats.easy.done, color: "#22c55e" },
    { name: "Medium", value: stats.medium.done, color: "#eab308" },
    { name: "Hard", value: stats.hard.done, color: "#ef4444" },
  ], [stats])

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
      return { date: dateStr, count }
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
      .filter(t => t.percent < 100) // Exclude 100%, include 0%
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 8)
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
      } else {
        break
      }
    }

    return currentStreak
  }, [problems])

  const filteredTopics = useMemo(() => {
    return topics.filter(t => t.name.toLowerCase().includes(topicSearch.toLowerCase()))
  }, [topics, topicSearch])


  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading deep analytics...</div>

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Analytics
          </h2>
          <p className="text-muted-foreground font-medium">Data-driven insights into your performance</p>
        </div>
        <div className="flex gap-2 p-1 bg-muted/50 rounded-lg border">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-md shadow-sm border border-primary/10">
            <Flame className={cn("h-4 w-4", streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
            <span className="text-sm font-bold">{streak} Day Streak</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Overall Progress"
          value={`${stats.percent.toFixed(1)}%`}
          subValue={`${stats.solved}/${stats.total} Solved`}
          icon={TrendingUp}
          color="primary"
          progress={stats.percent}
        />
        <MetricCard
          title="Easy Problems"
          value={stats.easy.done}
          subValue={`${Math.round((stats.easy.done / stats.easy.total) * 100 || 0)}% completed`}
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Medium Problems"
          value={stats.medium.done}
          subValue={`${Math.round((stats.medium.done / stats.medium.total) * 100 || 0)}% completed`}
          icon={BarChart3}
          color="yellow"
        />
        <MetricCard
          title="Hard Problems"
          value={stats.hard.done}
          subValue={`${Math.round((stats.hard.done / stats.hard.total) * 100 || 0)}% completed`}
          icon={Flame}
          color="red"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">Overview</TabsTrigger>
          <TabsTrigger value="topics" className="data-[state=active]:bg-background">Topics</TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-background">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Difficulty Distribution</CardTitle>
                <CardDescription>Breakdown of problems solved by complexity</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-muted/60">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Top Performing Topics</CardTitle>
                <CardDescription>% completion across major categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      fontSize={11}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ReTooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="percent" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="topics" className="space-y-6">
          <Card className="shadow-sm border-muted/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Topic Progress Explorer</CardTitle>
                <CardDescription>Deep dive into your mastery of each subject</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter subjects..."
                  className="pl-9 h-9"
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                {filteredTopics.map((topic, i) => (
                  <div key={topic.id} className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-all space-y-3 group">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-sm group-hover:text-primary transition-colors">{topic.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">{topic.solved} / {topic.total} Solved</p>
                      </div>
                      <Link href={`/dashboard/topic/${topic.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                    <Progress value={(topic.solved / topic.total) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="shadow-sm border-muted/60">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Activity Trend</CardTitle>
              <CardDescription>Problems solved over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis
                    dataKey="date"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickCount={6}
                  />
                  <ReTooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, subValue, icon: Icon, color, progress }: any) {
  const colorMap: any = {
    primary: "text-primary bg-primary/10 border-primary/20",
    green: "text-green-500 bg-green-500/10 border-green-500/20",
    yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    red: "text-red-500 bg-red-500/10 border-red-500/20",
  }

  return (
    <Card className="shadow-sm overflow-hidden relative border-muted/60 group hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2 rounded-xl border", colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {progress !== undefined && (
            <div className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
              Excellent
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
            <span className="text-[11px] font-bold text-muted-foreground uppercase">{subValue}</span>
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-4 pt-4 border-t border-dashed">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
