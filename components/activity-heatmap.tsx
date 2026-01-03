"use client"

import React, { useMemo } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ActivityHeatmapProps {
    data: { date: string; count: number }[]
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
    const getColor = (count: number) => {
        if (count === 0) return "bg-muted/50 dark:bg-muted/20 border border-border/50"
        if (count === 1) return "bg-[#FB923C]/30 border border-[#FB923C]/30"
        if (count === 2) return "bg-[#FB923C]/50 border border-[#FB923C]/50"
        if (count === 3) return "bg-[#FB923C]/70 border border-[#FB923C]/70"
        return "bg-[#FB923C] shadow-[0_0_8px_rgba(251,146,60,0.4)] border border-[#FB923C]"
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">Activity</h4>
                    <div className="flex items-center gap-1.5 opacity-60">
                        <span className="text-[8px] font-bold uppercase tracking-tighter">Less</span>
                        <div className="flex gap-1">
                            <div className="h-2 w-2 rounded-[1px] bg-muted/30" />
                            <div className="h-2 w-2 rounded-[1px] bg-[#FB923C]/30" />
                            <div className="h-2 w-2 rounded-[1px] bg-[#FB923C]/60" />
                            <div className="h-2 w-2 rounded-[1px] bg-[#FB923C]" />
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-tighter">More</span>
                    </div>
                </div>

                <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 lg:gap-2 p-4 bg-muted/20 border border-border/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {data.slice(-30).map((day, i) => (
                        <Tooltip key={day.date}>
                            <TooltipTrigger asChild>
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: i * 0.01 }}
                                    className={cn(
                                        "aspect-square w-full rounded-[4px] cursor-pointer transition-all hover:ring-2 hover:ring-primary/40",
                                        getColor(day.count)
                                    )}
                                    role="img"
                                    aria-label={`${day.count} ${day.count === 1 ? 'problem' : 'problems'} solved on ${day.date}`}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-black/90 text-white border-primary/20 rounded-lg p-2">
                                <p className="text-[10px] font-black uppercase tracking-tight">
                                    {day.count} {day.count === 1 ? 'Problem' : 'Problems'}
                                </p>
                                <p className="text-[8px] font-medium opacity-60">
                                    {day.date}
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>

                <p className="text-[9px] font-bold text-muted-foreground/40 text-center uppercase tracking-[0.2em] italic">
                    Rolling 30-Day Execution Protocol
                </p>
            </div>
        </TooltipProvider>
    )
}
