"use client"

import React, { useEffect, useState } from "react"
import { getSessionData, BookedSession } from "@/lib/local-storage"
import { Video, Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react"
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

    if (sessions.length === 0) return null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tight italic">Upcoming Sessions</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-60">Your 1-on-1 Mentorship Schedule</p>
                </div>
                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-primary hover:text-primary/80">
                    View All <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.slice(0, 2).map((session) => (
                    <div
                        key={session.id}
                        className="group relative p-6 rounded-[32px] border bg-card hover:border-primary/40 hover:shadow-xl transition-all overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full group-hover:bg-primary/10 transition-all duration-500" />

                        <div className="flex items-center gap-4 relative z-10 mb-6">
                            <img
                                src={session.mentorImage}
                                alt={session.mentorName}
                                className="w-12 h-12 rounded-2xl object-cover border-2 border-background shadow-sm"
                            />
                            <div className="space-y-0.5">
                                <h4 className="font-black text-sm uppercase tracking-tight">{session.mentorName}</h4>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">{session.mentorTitle}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-black uppercase tracking-tight">{format(parseISO(session.date), "MMM dd, yyyy")}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="text-[11px] font-black uppercase tracking-tight">{session.time}</span>
                            </div>
                        </div>

                        <Button
                            asChild
                            className="w-full h-11 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        >
                            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                                Join Meeting <Video className="ml-2 h-3.5 w-3.5" />
                            </a>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
