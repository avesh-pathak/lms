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
            .filter(p => p.starred || p.tags?.includes("Revision"))
            .slice(0, 5) // Top 5 for the sidebar/widget
    }, [problems])

    if (loading || queue.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-wider text-muted-foreground">Revision Queue</h3>
                <Badge variant="outline" className="text-[10px] font-black">{queue.length}</Badge>
            </div>

            <div className="space-y-2">
                {queue.map((prob) => (
                    <Link
                        key={prob._id}
                        href={`/dashboard/topic/${toSlug(prob.topic)}?expand=${prob._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl border bg-card/30 hover:bg-muted/30 transition-all group border-dashed"
                    >
                        <div className="p-2 rounded-full bg-yellow-500/5 text-yellow-500 group-hover:bg-yellow-500/10 transition-colors">
                            {prob.starred ? <Star className="h-3.5 w-3.5 fill-current" /> : <RefreshCcw className="h-3.5 w-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{prob.title}</h4>
                            <p className="text-xs font-medium text-muted-foreground truncate">{prob.topic}</p>
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                ))}
            </div>
        </div>
    )
}
