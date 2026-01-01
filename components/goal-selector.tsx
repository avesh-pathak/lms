"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Layers, Cpu, Brain, Zap, ArrowRight } from "lucide-react"

interface GoalSelectorProps {
    onSelect: (goal: string) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function GoalSelector({ onSelect, open: externalOpen, onOpenChange }: GoalSelectorProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = onOpenChange || setInternalOpen
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null)

    useEffect(() => {
        const storedGoal = localStorage.getItem("user_learning_goal")
        if (!storedGoal) {
            setOpen(true)
        }
    }, [])

    const goals = [
        {
            id: "DSA",
            title: "DSA Patterns",
            description: "Master algorithms & problem solving for top-tier interviews.",
            icon: Layers,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/50"
        },
        {
            id: "Core Engineering",
            title: "Core Engineering",
            description: "Deep dive into OS, DBMS, Networks, and System Design.",
            icon: Cpu,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            border: "group-hover:border-orange-500/50"
        },
        {
            id: "AI/ML",
            title: "AI & Machine Learning",
            description: "Build intelligence with Neural Networks and Modern AI.",
            icon: Brain,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "group-hover:border-purple-500/50"
        }
    ]

    const handleConfirm = () => {
        if (selectedGoal) {
            localStorage.setItem("user_learning_goal", selectedGoal)
            onSelect(selectedGoal)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] bg-card border-none shadow-2xl rounded-[32px] p-8 overflow-hidden">
                <DialogHeader className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Zap className="h-6 w-6 text-primary animate-pulse" />
                    </div>
                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-center">
                        Choose Your <span className="text-primary">Objective</span>
                    </DialogTitle>
                    <DialogDescription className="text-center font-medium text-muted-foreground text-sm">
                        Welcome, Engineer. Select your primary focus area to personalize your mission path.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-8">
                    {goals.map((goal) => (
                        <button
                            key={goal.id}
                            onClick={() => setSelectedGoal(goal.id)}
                            className={cn(
                                "group relative flex items-center gap-5 p-5 rounded-2xl border transition-all text-left",
                                selectedGoal === goal.id
                                    ? "bg-muted border-primary/50 shadow-lg scale-[1.02]"
                                    : "bg-background border-border/50 hover:bg-muted/50"
                            )}
                        >
                            <div className={cn("shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", goal.bg, goal.color)}>
                                <goal.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="font-black italic uppercase tracking-tight text-sm">
                                    {goal.title}
                                </h3>
                                <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                    {goal.description}
                                </p>
                            </div>
                            {selectedGoal === goal.id && (
                                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-ping" />
                            )}
                        </button>
                    ))}
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedGoal}
                        className="w-full h-14 rounded-2xl font-black italic uppercase tracking-wider text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        Initialize Mission
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
