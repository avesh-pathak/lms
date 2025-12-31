"use client"

import React from "react"
import { useProblems } from "@/components/problems-provider"
import { Repeat, Clock, CheckCircle2, AlertCircle, ArrowRight, Zap, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn, toSlug } from "@/lib/utils"
import Link from "next/link"

export default function RevisionPage() {
    const { problems, topics, loading } = useProblems()

    const reviewProblems = problems.filter(p => p.isReviewDue)
    const completedProblems = problems.filter(p => p.status === "Completed")

    const masteryPercentage = problems.length > 0
        ? (completedProblems.length / problems.length) * 100
        : 0

    if (loading) {
        return <div className="p-8">Loading mastery data...</div>
    }

    return (
        <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Repeat className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Revision Center</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
                        Mastery is <br /> <span className="text-primary truncate">Retention.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                        Spaced Repetition (SRS) ensures your technical depth doesn't decay. Review what matters, when it matters.
                    </p>
                </div>

                <div className="bg-card p-8 rounded-[40px] border shadow-xl space-y-4 min-w-[300px]">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Mastery</span>
                            <div className="text-4xl font-black italic">{masteryPercentage.toFixed(0)}%</div>
                        </div>
                        <Trophy className="h-10 w-10 text-primary opacity-20" />
                    </div>
                    <Progress value={masteryPercentage} className="h-2 bg-muted transition-all" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase text-center tracking-widest">
                        {completedProblems.length} / {problems.length} Concepts Solidified
                    </p>
                </div>
            </div>

            {/* Revision Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Due for Review */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <Clock className="h-6 w-6 text-red-500" />
                            Due for <span className="text-red-500">Review</span>
                        </h2>
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-black uppercase text-[10px] h-6">
                            {reviewProblems.length} Pending
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviewProblems.map(p => (
                            <Link
                                key={p._id}
                                href={`/dashboard/topic/${toSlug(p.topic)}`}
                                className="group p-6 rounded-[32px] border bg-card/50 hover:border-red-500/30 transition-all hover:-translate-y-1 hover:shadow-xl space-y-4"
                            >
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="text-[8px] font-black uppercase border-red-500/20 text-red-500">
                                        {p.domain}
                                    </Badge>
                                    <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                        <Zap className="h-4 w-4 fill-current" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-red-500 transition-colors italic">
                                        {p.title}
                                    </h4>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        Part of {p.topic}
                                    </p>
                                </div>
                                <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 opacity-60 group-hover:opacity-100 transition-opacity">
                                    Revise Now <ArrowRight className="h-3 w-3" />
                                </div>
                            </Link>
                        ))}
                        {reviewProblems.length === 0 && (
                            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-[48px] bg-emerald-500/[0.02] border-emerald-500/20 space-y-4">
                                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Your Mind is Sharp.</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No concepts due for review right now.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recently Mastered */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        Solidified
                    </h2>
                    <div className="space-y-3">
                        {completedProblems.slice(0, 5).map(p => (
                            <div key={p._id} className="p-4 rounded-2xl border bg-muted/20 flex items-center gap-4">
                                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="text-xs font-black uppercase tracking-tight truncate">{p.title}</h5>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{p.domain}</p>
                                </div>
                            </div>
                        ))}
                        {completedProblems.length === 0 && (
                            <div className="p-8 text-center border-2 border-dashed rounded-[32px] opacity-40">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No completions indexed.</p>
                            </div>
                        )}
                        {completedProblems.length > 5 && (
                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">
                                + {completedProblems.length - 5} More Mastered
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
