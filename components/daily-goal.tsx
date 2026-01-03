"use client"

import React, { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Trophy, Edit2, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { getSessionData, saveSessionData } from "@/lib/local-storage"
import { cn } from "@/lib/utils"

type DailyGoalProps = {
    completedToday: number
}

export function DailyGoal({ completedToday }: DailyGoalProps) {
    const [goal, setGoal] = useState(3)
    const [isEditing, setIsEditing] = useState(false)
    const [customValue, setCustomValue] = useState("")

    useEffect(() => {
        const session = getSessionData()
        if (session.dailyGoal) {
            setGoal(session.dailyGoal)
        }
    }, [])

    const handleSave = (newGoal: string | number) => {
        const val = typeof newGoal === "string" ? parseInt(newGoal) : newGoal
        if (isNaN(val) || val < 1) return
        setGoal(val)
        saveSessionData({ dailyGoal: val })
        setIsEditing(false)
        setCustomValue("")
    }

    const progress = Math.min((completedToday / goal) * 100, 100)
    const isCompleted = completedToday >= goal

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-10 w-10 md:h-12 md:w-12 rounded-2xl flex items-center justify-center transition-all border",
                        isCompleted
                            ? "bg-[#FB923C] text-white border-[#FB923C]/20 shadow-lg shadow-[#FB923C]/20"
                            : "bg-muted/50 text-muted-foreground border-border/50"
                    )}>
                        {isCompleted ? <Trophy className="h-5 w-5 md:h-6 md:w-6" /> : <Target className="h-5 w-5 md:h-6 md:w-6" />}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                        <h3 className="text-[10px] md:text-sm font-black uppercase tracking-tight italic truncate">Today's Target</h3>
                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            <p className="text-xl md:text-2xl font-black tracking-tighter tabular-nums leading-none">
                                {completedToday}<span className="text-muted-foreground/30 mx-0.5">/</span>{goal}
                            </p>
                            <span className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground opacity-40 truncate">Protocols</span>
                        </div>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-9 md:w-9 rounded-xl hover:bg-[#FB923C]/10 hover:text-[#FB923C] transition-all shrink-0"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Edit2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
            </div>

            {isEditing ? (
                <div className="p-3 bg-muted/20 border rounded-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="space-y-1.5">
                        <label className="text-[8px] font-black uppercase text-muted-foreground px-1 tracking-widest">Select Objective</label>
                        <div className="grid grid-cols-4 gap-2">
                            {[3, 5, 10, 15].map((val) => (
                                <Button
                                    key={val}
                                    variant={goal === val ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "h-8 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                        goal === val ? "bg-[#FB923C] hover:bg-[#FB923C]/90 text-white shadow-md shadow-[#FB923C]/20" : "bg-card hover:bg-muted"
                                    )}
                                    onClick={() => handleSave(val)}
                                >
                                    {val}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="number"
                                min="1"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                placeholder="Custom"
                                className="w-full h-8 bg-card border rounded-lg px-2 text-[10px] font-bold outline-none focus:ring-1 focus:ring-[#FB923C]/50 transition-all"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSave(customValue)
                                    }
                                }}
                            />
                        </div>
                        <Button
                            className="h-8 px-3 rounded-lg bg-[#FB923C] hover:bg-[#FB923C]/90 text-white font-black uppercase tracking-widest text-[9px] shrink-0"
                            onClick={() => handleSave(customValue)}
                        >
                            Sync
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2.5 px-0.5">
                    <div className="relative h-2.5 bg-muted/50 rounded-full overflow-hidden border border-border/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", damping: 20, stiffness: 100 }}
                            className="absolute inset-y-0 left-0 bg-[#FB923C] shadow-[0_0_10px_rgba(251,146,60,0.3)]"
                        />
                    </div>
                    <div className="flex items-center justify-between text-[8px] md:text-[9px] font-black uppercase tracking-widest italic opacity-60">
                        <span className={isCompleted ? "text-[#FB923C] opacity-100" : ""}>
                            {isCompleted ? "System Optimized" : "Syncing Node..."}
                        </span>
                        <span>{progress.toFixed(0)}%</span>
                    </div>
                </div>
            )}
        </div>
    )
}
