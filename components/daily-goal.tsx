"use client"

import React, { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Trophy, Edit2 } from "lucide-react"
import { getSessionData, saveSessionData } from "@/lib/local-storage"

type DailyGoalProps = {
    completedToday: number
}

export function DailyGoal({ completedToday }: DailyGoalProps) {
    const [goal, setGoal] = useState(3)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const session = getSessionData()
        if (session.dailyGoal) {
            setGoal(session.dailyGoal)
        }
    }, [])

    const handleSave = (newGoal: number) => {
        setGoal(newGoal)
        saveSessionData({ dailyGoal: newGoal })
        setIsEditing(false)
    }

    const progress = Math.min((completedToday / goal) * 100, 100)
    const isCompleted = completedToday >= goal

    return (
        <div className="p-6 border rounded-[32px] bg-card hover:shadow-xl transition-all space-y-5 border-border/60">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-3 rounded-2xl shadow-inner transition-all",
                        isCompleted ? "bg-primary text-white" : "bg-primary/10 text-primary"
                    )}>
                        {isCompleted ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-sm font-black uppercase tracking-tight italic">Daily Target</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                            {completedToday} / {goal} SOLVED
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
            </div>

            {isEditing ? (
                <div className="p-2 bg-muted/30 rounded-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                    {[1, 3, 5, 10].map((val) => (
                        <Button
                            key={val}
                            variant={goal === val ? "default" : "ghost"}
                            size="sm"
                            className={cn(
                                "flex-1 h-9 rounded-xl text-xs font-black uppercase tracking-widest",
                                goal === val ? "shadow-lg shadow-primary/25" : "hover:bg-primary/5"
                            )}
                            onClick={() => handleSave(val)}
                        >
                            {val}
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden border border-muted-foreground/10 shadow-inner">
                        <div
                            className="absolute inset-y-0 left-0 bg-primary transition-all duration-700 ease-out shadow-[0_0_12px_rgba(251,146,60,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {isCompleted && (
                        <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase tracking-widest italic animate-pulse">
                            <Zap className="h-3 w-3" /> System Optimized. Milestone Reached.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

import { Zap } from "lucide-react"

// Utility to fix the cn import if needed (I'll just import it in the file)
import { cn } from "@/lib/utils"
