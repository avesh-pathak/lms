"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Play, Clock, ArrowRight } from "lucide-react"
import type { MongoDBProblem } from "@/lib/types"
import { toSlug } from "@/lib/utils"
import Link from "next/link"

type ContinueLearningProps = {
    problem: MongoDBProblem | null
}

export function ContinueLearning({ problem }: ContinueLearningProps) {
    if (!problem) return null

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        if (mins < 60) return `${mins}m`
        const hrs = Math.floor(mins / 60)
        return `${hrs}h ${mins % 60}m`
    }

    return (
        <div className="relative group p-5 border rounded-xl bg-primary/5 border-primary/20 overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5">
            <div className="absolute top-0 right-0 p-8 text-primary/10 transition-transform group-hover:scale-110 group-hover:rotate-12">
                <Play className="h-24 w-24 fill-current" />
            </div>

            <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Continue Learning</span>
                    <h3 className="text-xl font-bold tracking-tight">{problem.title}</h3>
                    <p className="text-sm text-muted-foreground">{problem.topic}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{problem.timeSpent ? formatTime(problem.timeSpent) : "0m"} spent</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter h-5">
                        {problem.difficulty}
                    </Badge>
                </div>

                <Button asChild className="w-full gap-2 shadow-sm font-semibold">
                    <Link href={`/dashboard/topic/${toSlug(problem.topic)}?expand=${problem._id}`}>
                        Resume Practice
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}

import { Badge } from "@/components/ui/badge"
