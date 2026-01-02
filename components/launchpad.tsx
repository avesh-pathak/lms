"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { toSlug, cn } from "@/lib/utils"
import { MongoDBProblem, Topic } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    ArrowRight,
    Zap,
    Clock,
    Flame,
    Search,
    BookOpen,
    Target,
    Trophy,
    History,
    TrendingUp,
    ChevronRight,
    Repeat,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GoalSelector } from "./goal-selector"

interface LaunchpadProps {
    problems: MongoDBProblem[]
    topics: Topic[]
}

export function Launchpad({ problems, topics }: LaunchpadProps) {
    const [mounted, setMounted] = React.useState(false)
    const [userGoal, setUserGoal] = useState<string | null>(null)
    const [isGoalOpen, setIsGoalOpen] = useState(false)

    React.useEffect(() => {
        setMounted(true)
        setUserGoal(localStorage.getItem("user_learning_goal"))
    }, [])

    // 1. Resume Hero: Most recent "In Progress" problem (Optimized O(N) search)
    const resumeProblem = useMemo(() => {
        let latest: MongoDBProblem | null = null
        for (const p of problems) {
            if (p.status === "In Progress") {
                if (!latest || new Date(p.updatedAt).getTime() > new Date(latest.updatedAt).getTime()) {
                    latest = p
                }
            }
        }
        return latest
    }, [problems])

    // 2. Hot Zone: Overdue revisions
    const hotZoneProblems = useMemo(() => {
        return problems
            .filter(p => p.isReviewDue)
            .slice(0, 3)
    }, [problems])

    // 3. Stats Summary (Domain Reactive)
    const stats = useMemo(() => {
        const activeDomain = userGoal || "DSA"

        // 1. Get all topic names belonging to this domain
        const domainTopicNames = new Set(
            topics.filter(t => t.domain === activeDomain).map(t => t.name)
        )

        // 2. Filter problems that belong to those topics
        const domainProblems = problems.filter(p => domainTopicNames.has(p.topic))

        const total = domainProblems.length
        const solved = domainProblems.filter(p => p.status === "Completed").length
        const mastery = total > 0 ? (solved / total) * 100 : 0

        // Quests (Remain global or could be domain specific - keeping global for "Daily" feel)
        const solvedToday = problems.filter(p => {
            if (p.status !== "Completed") return false
            const updateDate = new Date(p.updatedAt).toDateString()
            const today = new Date().toDateString()
            return updateDate === today
        }).length

        return { total, solved, mastery, solvedToday, activeDomain }
    }, [problems, topics, userGoal])

    const questProgress = useMemo(() => {
        let count = 0
        if (stats.solvedToday > 0) count++
        if (hotZoneProblems.length === 0) count++
        // Final one is placeholder for theory reading
        return (count / 3) * 100
    }, [stats.solvedToday, hotZoneProblems.length])

    if (!mounted) return null

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <GoalSelector
                onSelect={(goal) => {
                    setUserGoal(goal)
                    setIsGoalOpen(false)
                }}
                open={isGoalOpen}
                onOpenChange={setIsGoalOpen}
            />
            {/* Hero: Action Plan */}
            <section className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-[32px] blur-xl opacity-25 group-hover:opacity-40 transition-opacity" />
                <Card className="relative overflow-hidden border-none bg-[#FDF5F0] rounded-[32px] shadow-sm border border-orange-100/50">
                    <CardContent className="p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div className="space-y-4 max-w-xl text-center lg:text-left relative z-10">
                            <div className="flex items-center gap-2 justify-center lg:justify-start">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50/80 backdrop-blur-sm border border-rose-100 text-rose-600 font-black uppercase text-xs tracking-widest italic shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    Mission Active: {userGoal || "DSA"}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsGoalOpen(true)}
                                    className="h-8 px-3 rounded-xl text-xs font-black uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-100/50 transition-all active:scale-95"
                                >
                                    Change Mission
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-[0.85] text-[#1A1A1A]">
                                    Ready to <span className="text-[#FB923C] relative italic">Execute?
                                        <div className="absolute -bottom-1 left-0 w-full h-2 bg-[#FB923C]/10 -skew-x-12" />
                                    </span>
                                </h2>
                                <p className="text-sm text-[#1A1A1A]/60 font-medium max-w-xs">
                                    {resumeProblem
                                        ? `You were mid-way through "${resumeProblem.title}".`
                                        : "Start your curated daily session now."
                                    }
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                                {resumeProblem ? (
                                    <Button asChild size="sm" className="rounded-xl h-12 px-6 font-black uppercase italic tracking-wider transition-all hover:scale-105 shadow-md shadow-orange-500/10 bg-[#FB923C] text-white border-0 text-xs">
                                        <Link href={`/dashboard/topic/${toSlug(resumeProblem.topic)}`}>
                                            <Zap className="mr-2 h-4 w-4 fill-current" />
                                            Resume
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild size="sm" className="rounded-xl h-12 px-10 font-black uppercase italic tracking-wider transition-all hover:scale-105 shadow-md shadow-orange-500/10 bg-[#FB923C] text-white border-0 text-xs">
                                        <Link href={`/dashboard?domain=${userGoal || "DSA"}`}>
                                            <Zap className="mr-2 h-4 w-4 fill-current" />
                                            Start Learning
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Mastery Orbit (Screenshot Style) */}
                        <div className="relative shrink-0 flex items-center justify-center w-40 h-40 lg:mr-4">
                            <div className="absolute inset-0 rounded-full border-[8px] border-white/50" />

                            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-white/20"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="44"
                                    stroke="#FB923C"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray="276.46"
                                    strokeDashoffset={276.46 - (276.46 * stats.mastery) / 100}
                                    strokeLinecap="round"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-0.5">
                                <span className="text-[8px] font-black text-[#1A1A1A]/30 uppercase tracking-[0.2em] leading-none">System Sync</span>
                                <span className="text-4xl font-black italic text-[#1A1A1A]">{stats.mastery.toFixed(0)}%</span>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-[#FB923C] pt-1">{stats.solved} / {stats.total}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: The Hot Zone */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                            <Flame className="h-5 w-5 text-orange-600 animate-pulse" />
                            The Hot Zone <span className="text-xs font-medium text-muted-foreground opacity-50 lowercase not-italic ml-2">(High pressure revisions)</span>
                        </h3>
                        <Link href="/dashboard/revision" className="text-[10px] font-black uppercase text-primary hover:underline underline-offset-4">View Full Stack</Link>
                    </div>

                    <div className="space-y-4">
                        {hotZoneProblems.length > 0 ? hotZoneProblems.map(p => (
                            <Link
                                key={p._id}
                                href={`/dashboard/topic/${toSlug(p.topic)}`}
                                className="group flex items-center justify-between p-5 rounded-[28px] bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all hover:translate-x-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black italic border border-orange-600/20">
                                        {p.difficulty[0]}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-black uppercase italic tracking-tighter truncate max-w-[200px] md:max-w-md group-hover:text-primary transition-colors">
                                            {p.title}
                                        </h4>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 flex items-center gap-2">
                                            <Repeat className="h-3 w-3" /> Due for {p.topic}
                                        </p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )) : (
                            <div className="p-12 rounded-[40px] border-2 border-dashed border-border/50 text-center space-y-4 bg-muted/5">
                                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <p className="text-sm font-black uppercase italic tracking-widest opacity-40">Your revision schedule is clear. Solid work!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Daily Quests */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2 px-2">
                        <Target className="h-5 w-5 text-primary" />
                        Execution Quests
                    </h3>
                    <div className="p-6 rounded-[32px] bg-card border border-border/50 space-y-6 shadow-xl shadow-black/5">
                        <QuestItem
                            label="Solve 1 New Pattern"
                            sub="Keep your execution sharp"
                            completed={stats.solvedToday > 0}
                        />
                        <QuestItem
                            label="Clear Your Hot Zone"
                            sub="Finalize all overdue revisions"
                            completed={hotZoneProblems.length === 0}
                        />
                        <QuestItem
                            label="Connect with a Mentor"
                            sub="Explore expert support modules"
                            completed={false}
                        />

                        <div className="pt-4 border-t border-border/50">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Daily Progress</span>
                                <span className="text-lg font-black italic">{questProgress.toFixed(0)}%</span>
                            </div>
                            <Progress value={questProgress} className="h-2 bg-muted rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Roadmap Tree View */}
            <section id="tech-tree" className="space-y-8 pb-12">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Engineering Tech Tree
                    </h3>
                </div>

                <div className="relative overflow-x-auto pb-8 pt-4 scrollbar-hide">
                    <div className="flex items-center gap-8 min-w-max px-2">
                        <TechTreeNode
                            stage="DSA Fundamentals"
                            level="Level 1"
                            completed={stats.mastery >= 25}
                            current={stats.mastery < 25}
                            percent={Math.min((stats.mastery / 25) * 100, 100)}
                            href="/dashboard?domain=DSA"
                        />
                        <TechTreeSeparator completed={stats.mastery >= 25} />
                        <TechTreeNode
                            stage="Advanced Patterns"
                            level="Level 2"
                            completed={stats.mastery >= 60}
                            current={stats.mastery >= 25 && stats.mastery < 60}
                            percent={stats.mastery >= 25 ? Math.min(((stats.mastery - 25) / 35) * 100, 100) : 0}
                            locked={stats.mastery < 25}
                            href="/dashboard?domain=DSA"
                        />
                        <TechTreeSeparator completed={stats.mastery >= 60} />
                        <TechTreeNode
                            stage="Core Engineering"
                            level="Level 3"
                            completed={stats.mastery >= 85}
                            current={stats.mastery >= 60 && stats.mastery < 85}
                            percent={stats.mastery >= 60 ? Math.min(((stats.mastery - 60) / 25) * 100, 100) : 0}
                            locked={stats.mastery < 60}
                            href="/dashboard?domain=Core Engineering"
                        />
                        <TechTreeSeparator completed={stats.mastery >= 85} />
                        <TechTreeNode
                            stage="System Architect"
                            level="Level 4"
                            locked={stats.mastery < 85}
                            href="/dashboard?domain=Core Engineering"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}

const QuestItem = React.memo(function QuestItem({ label, sub, completed }: { label: string, sub: string, completed: boolean }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className={cn(
                "shrink-0 h-5 w-5 rounded border mt-0.5 flex items-center justify-center transition-all",
                completed ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-border/50 bg-background group-hover:border-primary/50"
            )}>
                {completed && <Zap className="h-3 w-3 text-primary-foreground fill-current" />}
            </div>
            <div className="space-y-0.5">
                <h5 className={cn("text-xs font-black uppercase tracking-tight italic", completed ? "line-through opacity-40" : "text-foreground")}>{label}</h5>
                <p className="text-[10px] text-muted-foreground font-medium">{sub}</p>
            </div>
        </div>
    )
})

const TechTreeNode = React.memo(function TechTreeNode({ stage, level, completed, current, locked, percent = 0, href }: { stage: string, level: string, completed?: boolean, current?: boolean, locked?: boolean, percent?: number, href?: string }) {
    const content = (
        <div className={cn(
            "relative flex flex-col items-center gap-4 transition-all hover:scale-105",
            locked && "opacity-40 grayscale"
        )}>
            <div className={cn(
                "h-24 w-24 rounded-[32px] flex items-center justify-center border-4 relative overflow-hidden bg-card shadow-xl",
                completed && "border-primary/50 text-primary",
                current && "border-primary shadow-primary/20 animate-pulse",
                locked && "border-border/50 text-muted-foreground"
            )}>
                {completed ? <Trophy className="h-10 w-10" /> : current ? <Flame className="h-10 w-10 text-primary" /> : <Clock className="h-10 w-10" />}
                {current && (
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                )}
            </div>
            <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none block">{level}</span>
                <h4 className="text-xs font-black uppercase italic tracking-tighter whitespace-nowrap">{stage}</h4>
            </div>
        </div>
    )

    if (locked || !href) return content

    return (
        <Link href={href}>
            {content}
        </Link>
    )
})

function TechTreeSeparator({ completed }: { completed?: boolean }) {
    return (
        <div className="h-px w-20 bg-border flex items-center justify-center relative">
            <div className={cn(
                "absolute inset-0 h-px transition-all duration-1000",
                completed ? "bg-primary shadow-[0_0_8px_rgba(251,146,60,0.5)]" : "bg-transparent"
            )} style={{ width: completed ? '100%' : '0%' }} />
            <ChevronRight className={cn("h-4 w-4 relative z-10", completed ? "text-primary" : "text-muted/30")} />
        </div>
    )
}
