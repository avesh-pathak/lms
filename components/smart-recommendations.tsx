"use client"

import React, { useMemo } from "react"
import { useProblems } from "./problems-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Zap, Rocket, ArrowRight } from "lucide-react"
import { toSlug, cn } from "@/lib/utils"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function SmartRecommendations() {
    const { topics, problems, loading } = useProblems()

    const recommendations = useMemo(() => {
        if (loading || topics.length === 0) return []

        const sortedByCompletion = [...topics].sort((a, b) => {
            const aP = a.total > 0 ? a.solved / a.total : 0
            const bP = b.total > 0 ? b.solved / b.total : 0
            return aP - bP
        })

        const recs = []

        // 1. The Weak Link: From topic with lowest completion
        const weakTopic = sortedByCompletion.find(t => t.solved < t.total)
        if (weakTopic) {
            const prob = problems.find(p => p.topic === weakTopic.name && p.status !== "Completed")
            if (prob) {
                recs.push({
                    type: "Weak Link",
                    title: "Strengthen Your Base",
                    description: `Focus on ${weakTopic.name}`,
                    problem: prob,
                    icon: Lightbulb,
                    color: "text-orange-500 bg-orange-500/10",
                })
            }
        }

        // 2. Quick Win: Easy problem from a topic with >50% completion
        const masterTopic = topics.find(t => t.total > 0 && (t.solved / t.total) >= 0.5 && t.solved < t.total)
        if (masterTopic) {
            const easyProb = problems.find(p => p.topic === masterTopic.name && p.status !== "Completed" && p.difficulty === "Easy")
            if (easyProb) {
                recs.push({
                    type: "Quick Win",
                    title: "Maintain Momentum",
                    description: `Finish ${masterTopic.name}`,
                    problem: easyProb,
                    icon: Zap,
                    color: "text-yellow-500 bg-yellow-500/10",
                })
            }
        }

        // 3. Fresh Start: From an untouched topic
        const freshTopic = topics.find(t => t.solved === 0 && t.total > 0)
        if (freshTopic && recs.length < 3) {
            const freshProb = problems.find(p => p.topic === freshTopic.name)
            if (freshProb) {
                recs.push({
                    type: "Fresh Start",
                    title: "New Territory",
                    description: `Explore ${freshTopic.name}`,
                    problem: freshProb,
                    icon: Rocket,
                    color: "text-blue-500 bg-blue-500/10",
                })
            }
        }

        return recs.slice(0, 3)
    }, [topics, problems, loading])

    if (loading || recommendations.length === 0) return null

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recommended for You</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {recommendations.map((rec, i) => (
                    <Link
                        key={i}
                        href={`/dashboard/topic/${toSlug(rec.problem.topic)}?expand=${rec.problem._id}`}
                        className="group block p-4 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/40 transition-all hover:shadow-md relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                            <rec.icon className="h-16 w-16" />
                        </div>

                        <div className="relative z-10 flex items-start gap-4">
                            <div className={cn("p-2 rounded-lg shrink-0", rec.color)}>
                                <rec.icon className="h-4 w-4" />
                            </div>
                            <div className="space-y-1 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">{rec.type}</span>
                                    <Badge variant="secondary" className="px-1 text-[8px] h-3 uppercase">{rec.problem.difficulty}</Badge>
                                </div>
                                <h4 className="font-bold text-sm truncate">{rec.problem.title}</h4>
                                <p className="text-xs text-muted-foreground truncate">{rec.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto self-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1 text-primary" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
