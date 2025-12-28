"use client"

import React, { useState } from "react"
import { MOCK_LEADERBOARD, type LeaderboardEntry } from "@/lib/data/leaderboard"
import { Trophy, Medal, Flame, Search, Crown, ArrowUpRight, TrendingUp, Users, School, Globe, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<"global" | "college" | "friends">("global")
    const top3 = MOCK_LEADERBOARD.filter(u => !u.isCurrentUser).slice(0, 3)
    const others = MOCK_LEADERBOARD.filter(u => !u.isCurrentUser).slice(3)
    const currentUser = MOCK_LEADERBOARD.find(u => u.isCurrentUser)

    return (
        <div className="relative min-h-screen pb-32">
            <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase tracking-widest bg-primary/5 px-4 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse mr-2" />
                                Live Rankings
                            </Badge>
                        </div>
                        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                            The <span className="text-[#FB923C]">Babua</span> Elite.
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-md text-lg">
                            Proof of Work based rankings. Solve hard problems, achieve consistency, and climb the tiers.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex bg-muted/50 p-1 rounded-2xl border w-fit self-end">
                            <TabButton active={activeTab === "global"} onClick={() => setActiveTab("global")} icon={Globe}>Global</TabButton>
                            <TabButton active={activeTab === "college"} onClick={() => setActiveTab("college")} icon={School}>College</TabButton>
                            <TabButton active={activeTab === "friends"} onClick={() => setActiveTab("friends")} icon={Users}>Friends</TabButton>
                        </div>
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search builders..." className="pl-12 rounded-2xl border-muted/50 focus:border-[#FB923C]/50 h-14 text-lg shadow-sm bg-card" />
                        </div>
                    </div>
                </div>

                {/* Podium (Top 3) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-10">
                    <PodiumCard entry={top3[1]} place={2} className="md:order-1" />
                    <PodiumCard entry={top3[0]} place={1} className="md:order-2 scale-110 -translate-y-6" />
                    <PodiumCard entry={top3[2]} place={3} className="md:order-3" />
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
                                    <th className="px-10 py-5 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {others.map((user) => (
                                    <tr key={user.rank} className="group hover:bg-muted/30 transition-all duration-300">
                                        <td className="px-10 py-8">
                                            <span className="font-black text-2xl opacity-20 group-hover:opacity-100 transition-opacity">#{user.rank}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl border-2 border-muted overflow-hidden bg-card shadow-lg">
                                                        <img src={user.avatar} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className={cn("absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border shadow-sm", getTierColor(user.tier))}>
                                                        {user.tier}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="font-black text-lg group-hover:text-primary transition-colors">{user.name}</div>
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
                                                    <span>{user.problemsSolved} Problems</span>
                                                    <span className="opacity-50">92%</span>
                                                </div>
                                                <Progress value={80} className="h-1.5 w-32" />
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
                                                <div className="font-black text-2xl text-[#FB923C]">{user.points.toLocaleString()}</div>
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

            {/* Sticky Current User Rank Bar */}
            {currentUser && (
                <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
                    <div className="max-w-5xl mx-auto pointer-events-auto">
                        <div className="bg-foreground text-background rounded-[32px] p-6 shadow-2xl border-2 border-white/10 flex items-center justify-between gap-8 animate-in slide-in-from-bottom-10 duration-500">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col items-center justify-center bg-white/10 w-16 h-16 rounded-2xl border border-white/20">
                                    <span className="text-[10px] font-black uppercase opacity-60">Rank</span>
                                    <span className="text-2xl font-black">#{currentUser.rank}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl border-2 border-white/30 overflow-hidden relative">
                                        <img src={currentUser.avatar} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-primary/20" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-lg leading-none">Your Standing</h4>
                                        <p className="text-xs font-bold opacity-60 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Top 15% of all Builders
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex flex-1 max-w-sm flex-col gap-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span>{currentUser.tier} Tier</span>
                                    <span className="opacity-60">2,500 XP to Gold</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#FB923C] w-[65%] rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase opacity-60">Babua Points</div>
                                    <div className="text-xl font-black text-[#FB923C]">{currentUser.points.toLocaleString()}</div>
                                </div>
                                <Button className="bg-white text-black hover:bg-white/90 font-black rounded-xl h-12 px-6 gap-2">
                                    Claim Reward <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function PodiumCard({ entry, place, className }: { entry: any, place: number, className?: string }) {
    const colors = {
        1: { border: "border-yellow-500/50", bg: "bg-yellow-500/10", text: "text-yellow-500", shadow: "shadow-yellow-500/10", icon: "bg-yellow-500" },
        2: { border: "border-gray-400/50", bg: "bg-gray-400/10", text: "text-gray-400", shadow: "shadow-gray-400/10", icon: "bg-gray-400" },
        3: { border: "border-orange-400/50", bg: "bg-orange-400/10", text: "text-orange-400", shadow: "shadow-orange-400/10", icon: "bg-orange-400" }
    }[place] || { border: "border-muted", bg: "bg-muted/10", text: "text-muted", shadow: "", icon: "bg-muted" }

    return (
        <div className={cn("relative p-10 rounded-[48px] border-2 bg-card shadow-2xl flex flex-col items-center gap-6 transition-all hover:scale-105 group", colors.border, colors.shadow, className)}>
            <div className={cn("absolute -top-6 w-14 h-14 rounded-2xl border-4 border-background flex items-center justify-center text-white font-black text-2xl shadow-xl", colors.icon)}>
                {place}
            </div>

            <div className="relative">
                <div className="w-28 h-28 rounded-3xl border-4 border-background overflow-hidden shadow-2xl">
                    <img src={entry.avatar} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500" />
                </div>
                {place === 1 && <Crown className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-12 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-bounce" />}
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
                    <div className="font-black text-xl text-[#FB923C] leading-none">{entry.points.toLocaleString()}</div>
                </div>
                <div className="text-center">
                    <div className="text-[8px] font-black uppercase text-muted-foreground opacity-60">Solved</div>
                    <div className="font-black text-xl leading-none">{entry.problemsSolved}</div>
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
