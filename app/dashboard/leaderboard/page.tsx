"use client"

import React, { useState, useEffect } from "react"
import { MOCK_LEADERBOARD, type LeaderboardEntry } from "@/lib/data/leaderboard"
import { Flame, Search, TrendingUp, Users, School, Globe, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useProblems } from "@/components/problems-provider"

export default function LeaderboardPage() {
    const { problems } = useProblems()
    const [activeTab, setActiveTab] = useState<"global" | "college" | "friends">("global")
    const [timeRange, setTimeRange] = useState<"weekly" | "alltime">("alltime")
    const [dynamicMockData, setDynamicMockData] = useState(MOCK_LEADERBOARD)
    const [searchTerm, setSearchTerm] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setDynamicMockData(prev => {
                const count = Math.floor(Math.random() * 3) + 1
                const newEntries = [...prev]
                const indices = newEntries
                    .map((u, i) => u.isCurrentUser ? -1 : i)
                    .filter(i => i !== -1)

                // Shuffle
                for (let i = indices.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [indices[i], indices[j]] = [indices[j], indices[i]]
                }
                const selectedIndices = indices.slice(0, count)

                return newEntries.map((u, i) => {
                    if (selectedIndices.includes(i)) {
                        const gain = Math.floor(Math.random() * 150) + 50
                        let newPoints = u.points + gain
                        if (newPoints > 5000) newPoints = 3000 + (Math.random() * 200)

                        return {
                            ...u,
                            points: newPoints,
                            weeklyPoints: (u.weeklyPoints || 0) + Math.floor(gain / 2),
                            tier: getTier(newPoints) as any
                        }
                    }
                    return u
                })
            })
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    // Dynamic calculations for current user
    const solvedProblems = problems.filter(p => p.status === "Completed")
    const solvedCount = solvedProblems.length

    // Dynamic calculations with weighted points
    const pointsMap = { "Easy": 50, "Medium": 100, "Hard": 200 }
    const dynamicPoints = solvedProblems.reduce((acc, p) => acc + (pointsMap[p.difficulty as keyof typeof pointsMap] || 50), 0)

    const dynamicTier = getTier(dynamicPoints)

    const pointsToday = solvedProblems
        .filter(p => p.completedAt && new Date(p.completedAt).toDateString() === new Date().toDateString())
        .reduce((acc, p) => acc + (pointsMap[p.difficulty as keyof typeof pointsMap] || 50), 0)

    // Update dynamicMockData with real progress for the current user
    let leaderboardData = dynamicMockData.map(u => {
        if (u.isCurrentUser) {
            return {
                ...u,
                points: dynamicPoints,
                problemsSolved: solvedCount,
                tier: dynamicTier as any
            }
        }
        return u
    })

    const currentUser = leaderboardData.find(u => u.isCurrentUser)

    // Filter by Tab
    if (activeTab === "college") {
        const currentUserCollege = currentUser?.college || "IIT Bombay"
        leaderboardData = leaderboardData.filter(u => u.college === currentUserCollege)
    } else if (activeTab === "friends") {
        leaderboardData = leaderboardData.filter(u => u.isFriend || u.isCurrentUser)
    }

    // Pure Sort (creates sorted copy)
    const sortedData = [...leaderboardData]
        .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.college.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (timeRange === "weekly") {
                return (b.weeklyPoints ?? 0) - (a.weeklyPoints ?? 0)
            }
            return b.points - a.points
        })

    const top3 = sortedData.slice(0, 3)
    const others = sortedData.slice(3)
    const currentUserRank = sortedData.findIndex(u => u.isCurrentUser) + 1
    const nextUser = currentUserRank > 1 ? sortedData[currentUserRank - 2] : null
    const pointsToNextUser = nextUser ? nextUser.points - (currentUser?.points || 0) : 0

    // Next Tier logic
    const tiers = [
        { name: "Bronze", min: 0, max: 1000 },
        { name: "Silver", min: 1000, max: 2000 },
        { name: "Gold", min: 2000, max: 3000 },
        { name: "Platinum", min: 3000, max: 4000 },
        { name: "Diamond", min: 4000, max: 100000 }
    ]
    const currentTierIndex = tiers.findIndex(t => t.name === (dynamicTier || "Bronze"))
    const nextTier = tiers[currentTierIndex + 1]
    const pointsToNextTier = nextTier ? nextTier.min - dynamicPoints : 0
    const tierProgress = nextTier ? ((dynamicPoints - tiers[currentTierIndex].min) / (nextTier.min - tiers[currentTierIndex].min)) * 100 : 100

    if (!mounted) return <div className="min-h-screen bg-background" />

    return (
        <div className="relative min-h-screen pb-32">
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
                {/* Top Headers Section */}
                <div className="space-y-12">
                    {/* Header Row 1: Title & Standing */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase tracking-widest bg-primary/5 px-4 py-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
                                    Live Rankings
                                </Badge>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                                The <span className="text-[#FB923C]">Babua</span> Elite
                            </h1>
                            <p className="text-muted-foreground font-medium max-w-md text-lg">
                                Proof of Work based rankings. Solve hard problems, achieve consistency, and climb the tiers.
                            </p>
                        </div>

                        {/* Top Standing Card */}
                        {currentUser && (
                            <div className="max-w-[550px] w-full lg:mb-2 self-center scale-105 transform origin-right">
                                <div className="bg-white/95 text-black rounded-[32px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-black/5 flex items-center justify-between gap-6 animate-in fade-in slide-in-from-right-4 duration-700 backdrop-blur-xl">
                                    {/* Left Section: Compact User Info */}
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl border-2 border-black/10 overflow-hidden shadow-sm">
                                                <img src={currentUser.avatar} className="w-full h-full object-cover" alt={currentUser.name} />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500 animate-pulse" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black italic">#{currentUserRank}</span>
                                                <h4 className="font-black text-xs uppercase tracking-tighter">Your Standing</h4>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-black text-[#FB923C] uppercase tracking-tighter">
                                                <TrendingUp className="w-3.5 h-3.5" />
                                                <span>Top 15% Elite</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Center Section: Points Today */}
                                    <div className="flex flex-col items-center px-6 border-x border-black/5">
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Today</span>
                                        <div className="text-xl font-black text-green-600">↑ {pointsToday}</div>
                                    </div>

                                    {/* Right Section: Main Points & CTA */}
                                    <div className="flex items-center gap-5">
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-black italic leading-none">
                                                {(timeRange === "weekly" ? currentUser.weeklyPoints : currentUser.points)?.toLocaleString()}
                                            </div>
                                            <div className="text-[10px] font-black uppercase text-muted-foreground leading-none">Total XP</div>
                                        </div>
                                        <Button
                                            onClick={() => toast.info("Viewing Detailed Breakdown", {
                                                description: "This feature is coming soon in Babua Pro!"
                                            })}
                                            className="bg-[#FB923C] text-white hover:bg-[#F97316] font-black rounded-2xl h-12 w-12 shadow-lg border-b-4 border-orange-700 active:border-b-0 transition-all flex items-center justify-center p-0"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Header Row 2: Filters & Search */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex bg-muted/50 p-1 rounded-2xl border w-fit self-start gap-1">
                                <div className="flex bg-background/50 rounded-xl p-0.5 border shadow-inner mr-2">
                                    <button
                                        onClick={() => setTimeRange("alltime")}
                                        className={cn("px-4 py-2 rounded-[10px] text-[10px] font-black uppercase transition-all", timeRange === "alltime" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        All-time
                                    </button>
                                    <button
                                        onClick={() => setTimeRange("weekly")}
                                        className={cn("px-4 py-2 rounded-[10px] text-[10px] font-black uppercase transition-all", timeRange === "weekly" ? "bg-foreground text-background shadow-md" : "text-muted-foreground hover:text-foreground")}
                                    >
                                        Weekly
                                    </button>
                                </div>
                                <TabButton active={activeTab === "global"} onClick={() => setActiveTab("global")} icon={Globe}>Global</TabButton>
                                <TabButton active={activeTab === "college"} onClick={() => setActiveTab("college")} icon={School}>College</TabButton>
                                <TabButton active={activeTab === "friends"} onClick={() => setActiveTab("friends")} icon={Users}>Friends</TabButton>
                            </div>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search builders..."
                                className="pl-12 rounded-2xl border-muted/50 focus:border-[#FB923C]/50 h-14 text-lg shadow-sm bg-card"
                            />
                        </div>
                    </div>
                </div>

                {/* Podium (Top 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10">
                    <PodiumCard entry={top3[1]} place={2} className="md:order-1" timeRange={timeRange} />
                    <PodiumCard entry={top3[0]} place={1} className="md:order-2 scale-110 -translate-y-6" timeRange={timeRange} />
                    <PodiumCard entry={top3[2]} place={3} className="md:order-3" timeRange={timeRange} />
                </div>

                {/* Rankings Table */}
                <div className="bg-card rounded-[48px] border-2 shadow-2xl overflow-hidden">
                    <div className="p-8 border-b bg-muted/5 flex items-center justify-between">
                        <h3 className="font-black uppercase tracking-tight flex items-center gap-3 text-xl">
                            <TrendingUp className="w-6 h-6 text-[#FB923C]" />
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Standings
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 bg-muted px-3 py-1 rounded-full">
                                Last Updated: Just Now
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b bg-muted/10">
                                    <th className="px-10 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Rank</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Builder</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Efficiency</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Streak</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">{timeRange === "weekly" ? "Weekly PTS" : "Total PTS"}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {others.map((user, idx) => (
                                    <tr key={user.name} className="group hover:bg-muted/30 transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <span className="font-black text-2xl opacity-20 group-hover:opacity-100 transition-opacity">#{idx + 4}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl border-2 border-muted overflow-hidden bg-card shadow-lg">
                                                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                                    </div>
                                                    <div className={cn("absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border shadow-sm", getTierColor(user.tier))}>
                                                        {user.tier}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-black text-lg group-hover:text-primary transition-colors">
                                                        {user.name.replace(" (You)", "")} {user.isCurrentUser && "(You)"}
                                                    </div>
                                                    <div className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                                        <School className="w-3 h-3" />
                                                        {user.college}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs font-black uppercase tracking-tighter">
                                                    <span>{timeRange === 'weekly' ? user.weeklySolved : user.problemsSolved} Solved</span>
                                                    <span className="opacity-50">{(user.problemsSolved / 150 * 100).toFixed(0)}%</span>
                                                </div>
                                                <Progress value={(user.problemsSolved / 150 * 100)} className="h-1.5 w-32" />
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 font-black text-xl text-orange-500">
                                                    <Flame className="w-5 h-5 fill-current" />
                                                    {user.streak}
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Day Streak</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="space-y-1">
                                                <div className="font-black text-2xl text-[#FB923C] tabular-nums transition-all">
                                                    {(timeRange === "weekly" ? user.weeklyPoints : user.points).toLocaleString()}
                                                </div>
                                                <div className="text-[8px] font-black uppercase tracking-widest text-[#FB923C]/50">XP Earned</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PodiumCard({ entry, place, className, timeRange }: { entry?: LeaderboardEntry, place: number, className?: string, timeRange: string }) {
    if (!entry) return <div className={cn("invisible min-h-[300px]", className)} aria-hidden="true" />

    const colors = {
        1: { border: "border-yellow-500/50", bg: "bg-yellow-500/10", text: "text-yellow-500", shadow: "shadow-yellow-500/10", icon: "bg-yellow-500" },
        2: { border: "border-gray-400/50", bg: "bg-gray-400/10", text: "text-gray-400", shadow: "shadow-gray-400/10", icon: "bg-gray-400" },
        3: { border: "border-orange-400/50", bg: "bg-orange-400/10", text: "text-orange-400", shadow: "shadow-orange-400/10", icon: "bg-orange-400" }
    }[place as 1 | 2 | 3] || { border: "border-muted", bg: "bg-muted/10", text: "text-muted", shadow: "", icon: "bg-muted" }

    return (
        <div className={cn("relative p-10 rounded-[48px] border-2 bg-card shadow-2xl flex flex-col items-center gap-6 transition-all hover:scale-105 group", colors.border, colors.shadow, className)}>
            <div className={cn("absolute -top-6 w-14 h-14 rounded-2xl border-4 border-background flex items-center justify-center text-white font-black text-2xl shadow-xl", colors.icon)}>
                {place}
            </div>

            <div className="relative">
                <div className="w-28 h-28 rounded-3xl border-4 border-background overflow-hidden shadow-2xl">
                    <img src={entry.avatar} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" alt={entry.name} />
                </div>
            </div>

            <div className="text-center space-y-2">
                <h3 className="font-black text-2xl tracking-tight leading-none group-hover:text-primary transition-colors">{entry.name}</h3>
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className={cn("text-[8px] font-black uppercase px-2", getTierColor(entry.tier))}>
                        {entry.tier}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{entry.college}</span>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                <div className="text-center border-r border-dashed">
                    <div className="text-[8px] font-black uppercase text-muted-foreground opacity-60">Points</div>
                    <div className="font-black text-xl text-[#FB923C] leading-none">{(timeRange === "weekly" ? entry.weeklyPoints : entry.points).toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-[8px] font-black uppercase text-muted-foreground opacity-60">Solved</div>
                    <div className="font-black text-xl leading-none">{timeRange === "weekly" ? entry.weeklySolved : entry.problemsSolved}</div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase shadow-inner">
                <Flame className="w-3 h-3 fill-current" />
                {entry.streak} Day Continuous Streak
            </div>
        </div>
    )
}

function TabButton({ active, onClick, icon: Icon, children }: { active: boolean, onClick: () => void, icon: any, children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-black uppercase tracking-wide text-xs transition-all",
                active ? "bg-card text-foreground shadow-lg border" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className={cn("w-4 h-4", active ? "text-primary" : "opacity-50")} />
            {children}
        </button>
    )
}

function getTier(points: number) {
    if (points >= 4000) return "Diamond"
    if (points >= 3000) return "Platinum"
    if (points >= 2000) return "Gold"
    if (points >= 1000) return "Silver"
    return "Bronze"
}

function getTierColor(tier: string) {
    switch (tier) {
        case "Diamond": return "bg-blue-100 text-blue-600 border-blue-200"
        case "Platinum": return "bg-slate-100 text-slate-600 border-slate-200"
        case "Gold": return "bg-yellow-100 text-yellow-600 border-yellow-200"
        case "Silver": return "bg-gray-100 text-gray-600 border-gray-200"
        case "Bronze": return "bg-orange-100 text-orange-600 border-orange-200"
        default: return "bg-muted text-muted-foreground"
    }
}
