"use client"

import React, { useMemo } from "react"
import { useProblems } from "./problems-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Star, RefreshCcw, ArrowRight } from "lucide-react"
import { toSlug, cn } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function RevisionQueue() {
    const { problems, loading } = useProblems()

    const queue = useMemo(() => {
        return problems
            .filter(p => p.isReviewDue || p.starred || p.tags?.includes("Revision"))
            .sort((a, b) => {
                if (a.isReviewDue && !b.isReviewDue) return -1
                if (!a.isReviewDue && b.isReviewDue) return 1
                return 0
            })
            .slice(0, 5)
    }, [problems])

    if (loading || queue.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground italic">Revision Queue</h3>
                <Badge variant="outline" className="text-[9px] font-black border-primary/20 bg-primary/5 text-primary rounded-full">{queue.length}</Badge>
            </div>

            <div className="space-y-3">
                {queue.map((prob) => {
                    const topicUrl = `/dashboard/topic/${toSlug(prob.topic)}?expand=${prob._id}`
                    const problemUrl = prob.problem_link && prob.problem_link !== "None" ? prob.problem_link : topicUrl

                    return (
                        <div
                            key={prob._id}
                            className="flex items-center gap-4 p-4 rounded-3xl border bg-card/60 hover:bg-card hover:border-primary/40 transition-all group shadow-sm"
                        >
                            <a
                                href={problemUrl}
                                target={problemUrl === topicUrl ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                className={cn(
                                    "p-2.5 rounded-2xl transition-all shadow-inner shrink-0",
                                    prob.isReviewDue
                                        ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                        : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
                                )}
                            >
                                {prob.isReviewDue ? <RefreshCcw className="h-4 w-4 animate-spin-slow" /> : <Star className="h-4 w-4 fill-current" />}
                            </a>
                            <div className="min-w-0 flex-1">
                                <a
                                    href={problemUrl}
                                    target={problemUrl === topicUrl ? "_self" : "_blank"}
                                    rel="noopener noreferrer"
                                >
                                    <h4 className="text-[13px] font-black truncate hover:text-primary transition-colors leading-tight italic uppercase cursor-pointer">
                                        {prob.title}
                                    </h4>
                                </a>
                                <Link href={topicUrl}>
                                    <p className="text-[10px] font-bold text-muted-foreground truncate uppercase opacity-60 hover:opacity-100 hover:text-primary transition-all cursor-pointer">
                                        {prob.topic}
                                    </p>
                                </Link>
                            </div>
                            <a
                                href={problemUrl}
                                target={problemUrl === topicUrl ? "_self" : "_blank"}
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all cursor-pointer" />
                            </a>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
