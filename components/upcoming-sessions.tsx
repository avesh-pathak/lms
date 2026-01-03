"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { getSessionData, BookedSession } from "@/lib/local-storage"
import { Video, Calendar, Clock, ArrowRight, ExternalLink, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format, isAfter, parseISO } from "date-fns"

export function UpcomingSessions() {
    const [sessions, setSessions] = useState<BookedSession[]>([])

    useEffect(() => {
        const data = getSessionData()
        if (data.bookedSessions) {
            // Filter only upcoming sessions that haven't passed yet
            const upcoming = data.bookedSessions
                .filter(s => s.status === "upcoming" && isAfter(parseISO(s.date), new Date()))
                .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
            setSessions(upcoming)
        }
    }, [])

    if (sessions.length === 0) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight italic">Upcoming Sessions</h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">Temporal Sync Status: Null</p>
                    </div>
                </div>
                <div className="relative group overflow-hidden rounded-[48px] border-2 border-dashed border-primary/10 bg-muted/5 p-12 text-center transition-all hover:bg-muted/10 hover:border-primary/20">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-background border border-border/50 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl animate-pulse" />
                            <Calendar className="h-7 w-7 text-primary/40" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black uppercase tracking-[0.15em] italic">No active sessions scheduled</p>
                            <p className="text-[10px] font-medium text-muted-foreground/60 max-w-[280px] mx-auto leading-relaxed">
                                Establish a terminal connection with our elite mentors to accelerate your technical output.
                            </p>
                        </div>
                        <div className="pt-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                                <span className="h-1 w-1 rounded-full bg-primary/40 animate-ping" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">System Ready for Transmission</span>
                            </div>
                        </div>
                    </div>

                    {/* Corner Decoration */}
                    <div className="absolute bottom-4 right-6 opacity-[0.03] rotate-12 group-hover:scale-110 transition-all duration-700">
                        <Calendar className="h-24 w-24" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Upcoming Sessions</h3>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 italic">Your Active Mentorship Schedule</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 rounded-xl font-black text-[9px] uppercase tracking-widest text-[#FB923C] hover:bg-[#FB923C]/5 hover:text-[#FB923C]">
                    Access All Syncs <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.slice(0, 2).map((session) => (
                    <div
                        key={session.id}
                        className="group relative p-6 rounded-[38px] border bg-card hover:border-primary/50 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    >
                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FB923C]/5 -mr-12 -mt-12 rounded-full group-hover:bg-[#FB923C]/10 transition-all duration-700 ease-out" />

                        <div className="flex items-center gap-5 relative z-10 mb-8">
                            <div className="relative">
                                <div className="relative w-14 h-14 rounded-[20px] overflow-hidden border-2 border-background shadow-xl scale-100 group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src={session.mentorImage}
                                        alt={session.mentorName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-primary rounded-lg flex items-center justify-center border-2 border-background shadow-lg">
                                    <Video className="h-2.5 w-2.5 text-white" />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-base uppercase tracking-tight italic italic">{session.mentorName}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-bold text-[#FB923C] bg-[#FB923C]/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">{session.mentorCompany}</span>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 tracking-tight">• {session.mentorTitle}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 space-y-1 group-hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 text-[#FB923C]/80 font-black">
                                    <Calendar className="h-3 w-3" />
                                    <span className="text-[8px] uppercase tracking-widest">Chronological Node</span>
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight block">{format(parseISO(session.date), "EEE, MMM dd")}</span>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50 space-y-1 group-hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-2 text-[#FB923C]/80 font-black">
                                    <Clock className="h-3 w-3" />
                                    <span className="text-[8px] uppercase tracking-widest">Temporal Alignment</span>
                                </div>
                                <span className="text-xs font-black uppercase tracking-tight block">{session.time}</span>
                            </div>
                        </div>

                        <Button
                            asChild
                            className="w-full h-12 rounded-[20px] font-black uppercase tracking-[0.15em] text-[10px] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 active:scale-95 transition-all group-hover:-translate-y-0.5"
                        >
                            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                INITIALIZE SYNC <Zap className="ml-2 h-3.5 w-3.5 fill-current" />
                            </a>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
