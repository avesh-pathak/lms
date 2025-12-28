"use client"

import React from "react"
import { Calendar, Users, Trophy, ChevronRight, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface HackathonCardProps {
    id: string
    title: string
    description: string
    status: "active" | "upcoming" | "ended"
    participants: number
    startDate: string
    endDate: string
    prize: string
    pattern: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    progress?: number
}

export function HackathonCard({
    title,
    description,
    status,
    participants,
    startDate,
    endDate,
    prize,
    pattern,
    difficulty,
    progress
}: HackathonCardProps) {
    const isLive = status === "active"

    return (
        <Card className={cn(
            "group relative overflow-hidden border bg-card/50 backdrop-blur-sm transition-all hover:shadow-2xl hover:shadow-[#FB923C]/10 hover:-translate-y-1",
            isLive ? "border-[#FB923C]/50" : "border-border/50"
        )}>
            {/* Background Glow */}
            {isLive && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FB923C]/10 blur-[50px] -z-10 group-hover:bg-[#FB923C]/20 transition-all" />
            )}

            <CardHeader className="p-6 pb-2">
                <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            {isLive ? (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FB923C]/10 text-[#FB923C]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Now</span>
                                </div>
                            ) : (
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-muted/50 border-muted-foreground/20">
                                    {status}
                                </Badge>
                            )}
                            <Badge variant="secondary" className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-500" :
                                    difficulty === "Intermediate" ? "bg-[#FB923C]/10 text-[#FB923C]" :
                                        "bg-red-500/10 text-red-500"
                            )}>
                                {difficulty}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <Users className="h-3 w-3 text-muted-foreground" />
                            </div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                            <span className="text-[8px] font-bold">+{participants - 3}</span>
                        </div>
                    </div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[#FB923C] transition-colors line-clamp-1">{title}</h3>
                <p className="text-xs font-bold text-muted-foreground line-clamp-2 min-h-[32px]">{description}</p>
            </CardHeader>

            <CardContent className="p-6 pt-2 space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>{startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Trophy className="h-3 w-3 text-[#FB923C]" />
                        <span className="text-foreground">{prize}</span>
                    </div>
                </div>

                <div className="p-3 rounded-2xl bg-muted/30 border border-border/50 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                        <span className="text-muted-foreground">Core Pattern</span>
                        <span className="text-[#FB923C]">{pattern}</span>
                    </div>
                    {isLive && progress !== undefined && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-bold">
                                <span>Your Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1 bg-muted" />
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Button
                    className={cn(
                        "w-full h-12 rounded-2xl font-black uppercase tracking-tight group/btn transition-all shadow-xl",
                        isLive ? "bg-[#FB923C] text-white hover:bg-[#FB923C]/90 shadow-[#FB923C]/20" : "bg-muted text-muted-foreground"
                    )}
                >
                    {isLive ? "Continue Building" : "Join Waitlist"}
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
            </CardFooter>
        </Card>
    )
}
