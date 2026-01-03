"use client"

import React from "react"
import { Progress } from "@/components/ui/progress"
import { useProblems } from "@/components/problems-provider"

export const ProofOfWorkStats = React.memo(function ProofOfWorkStats() {
    const { problems, loading } = useProblems()

    const { solvedProblems, progress, totalProblems } = React.useMemo(() => {
        const total = 20
        const solved = problems ? problems.filter(p => p.status === "Completed").length : 0
        const prog = Math.min(Math.round((solved / total) * 100), 100)
        return { solvedProblems: solved, progress: prog, totalProblems: total }
    }, [problems])

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-muted rounded-2xl" />
                    <div className="h-16 bg-muted rounded-2xl" />
                </div>
                <div className="space-y-2">
                    <div className="h-2 bg-muted rounded-full w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border bg-muted/10 space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Topics Mastered</p>
                    <p className="text-2xl font-black tracking-tighter text-[#FB923C]">{solvedProblems}/{totalProblems}</p>
                </div>
                <div className="p-4 rounded-2xl border bg-muted/10 space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Mock Interviews</p>
                    <p className="text-2xl font-black tracking-tighter text-[#FB923C]">05</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Engineering Blueprint</span>
                    <span className="text-[#FB923C]">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 rounded-full" />
            </div>
        </div>
    )
})
