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
        <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto relative min-h-screen">
            {/* Engineering Grid Background */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <Repeat className="h-3.5 w-3.5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Revision Center</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
                        Mastery is <br /> <span className="text-primary truncate">Retention</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-lg max-w-xl leading-snug">
                        Spaced Repetition (SRS) ensures your technical depth doesn't decay. Review what matters, when it matters.
                    </p>
                </div>

                <div className="bg-background/60 backdrop-blur-xl p-8 rounded-[48px] border-2 border-primary/10 shadow-2xl space-y-5 min-w-[340px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-end relative z-10">
                        <div className="space-y-1">
                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Global Mastery</span>
                            <div className="text-5xl font-black italic tracking-tighter leading-none">{masteryPercentage.toFixed(0)}%</div>
                        </div>
                        <Trophy className="h-12 w-12 text-primary opacity-20 group-hover:opacity-40 transition-all group-hover:scale-110" />
                    </div>
                    <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-out"
                            style={{ width: `${masteryPercentage}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase text-center tracking-[0.2em]">
                        {completedProblems.length} / {problems.length} Concepts Solidified
                    </p>
                </div>
            </div>

            {/* Revision Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                {/* Due for Review */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between border-b-2 border-muted/30 pb-4">
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                            <Clock className="h-8 w-8 text-red-500" />
                            <span>Due for <span className="text-red-500">Review</span></span>
                        </h2>
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 font-black uppercase text-[11px] h-7 px-4 rounded-full">
                            {reviewProblems.length} Pending
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviewProblems.map(p => {
                            const topicUrl = `/dashboard/topic/${toSlug(p.topic)}?expand=${p._id}`
                            const problemUrl = p.problem_link && p.problem_link !== "None" ? p.problem_link : topicUrl

                            return (
                                <div
                                    key={p._id}
                                    className="group relative p-8 rounded-[40px] border-2 border-transparent bg-background/40 backdrop-blur-md hover:bg-background/80 hover:border-red-500/30 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.15)] space-y-6 overflow-hidden scrollbar-hide"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start relative z-10">
                                        <Badge variant="outline" className="text-[9px] font-black uppercase border-red-500/30 text-red-500 bg-red-500/5 px-3">
                                            {p.domain}
                                        </Badge>
                                        <div className="h-10 w-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                            <Zap className="h-5 w-5 fill-current" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 relative z-10">
                                        <a
                                            href={problemUrl}
                                            target={problemUrl === topicUrl ? "_self" : "_blank"}
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <h4 className="text-2xl font-black uppercase tracking-tight hover:text-red-500 transition-colors italic leading-none cursor-pointer">
                                                {p.title}
                                            </h4>
                                        </a>
                                        <Link href={topicUrl}>
                                            <p className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.1em] hover:text-primary transition-colors cursor-pointer">
                                                {p.topic}
                                            </p>
                                        </Link>
                                    </div>

                                    <a
                                        href={problemUrl}
                                        target={problemUrl === topicUrl ? "_self" : "_blank"}
                                        rel="noopener noreferrer"
                                        className="pt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-red-500 opacity-40 group-hover:opacity-100 transition-all cursor-pointer"
                                    >
                                        Revise Now <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                    </a>
                                </div>
                            )
                        })}
                        {reviewProblems.length === 0 && (
                            <div className="col-span-full py-24 text-center border-4 border-dashed rounded-[60px] bg-emerald-500/[0.03] border-emerald-500/10 space-y-6">
                                <div className="h-20 w-20 rounded-[32px] bg-emerald-500/10 flex items-center justify-center mx-auto shadow-inner shadow-emerald-500/20">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter">Mind Sharper Than Ever.</h3>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">Everything is solidified.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recently Mastered */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-4 text-muted-foreground/40 border-b-2 border-muted/30 pb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        Solidified
                    </h2>
                    <div className="space-y-4">
                        {completedProblems.map(p => {
                            const topicUrl = `/dashboard/topic/${toSlug(p.topic)}?expand=${p._id}`
                            const problemUrl = p.problem_link && p.problem_link !== "None" ? p.problem_link : topicUrl

                            return (
                                <div key={p._id} className="p-5 rounded-[28px] border-2 border-muted/20 bg-muted/5 backdrop-blur-sm flex items-center gap-5 group hover:bg-emerald-500/[0.02] hover:border-emerald-500/20 transition-all">
                                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-105 transition-transform">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <a
                                            href={problemUrl}
                                            target={problemUrl === topicUrl ? "_self" : "_blank"}
                                            rel="noopener noreferrer"
                                        >
                                            <h5 className="text-[13px] font-black uppercase tracking-tight truncate hover:text-emerald-600 transition-colors italic cursor-pointer">
                                                {p.title}
                                            </h5>
                                        </a>
                                        <Link href={topicUrl}>
                                            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest truncate hover:text-primary transition-colors cursor-pointer">
                                                {p.topic}
                                            </p>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                        {completedProblems.length === 0 && (
                            <div className="p-12 text-center border-2 border-dashed rounded-[40px] opacity-20">
                                <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                                <p className="text-[11px] font-black uppercase tracking-[0.2em]">Zero Mastered Particles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
