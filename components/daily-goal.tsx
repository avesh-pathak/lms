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
        <div className="p-5 border rounded-xl bg-card/50 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-2 rounded-lg",
                        isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        {isCompleted ? <Trophy className="h-4 w-4" /> : <Target className="h-4 w-4" />}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Daily Goal</h3>
                        <p className="text-xs text-muted-foreground">
                            {completedToday} of {goal} solved
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Edit2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            {isEditing ? (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    {[1, 3, 5, 10].map((val) => (
                        <Button
                            key={val}
                            variant={goal === val ? "default" : "outline"}
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={() => handleSave(val)}
                        >
                            {val}
                        </Button>
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    {isCompleted && (
                        <p className="text-[10px] text-primary font-medium animate-pulse">
                            Goal achieved! Keep it up! 🚀
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

// Utility to fix the cn import if needed (I'll just import it in the file)
import { cn } from "@/lib/utils"
