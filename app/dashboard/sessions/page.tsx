"use client"

import React, { useEffect, useState } from "react"
import { getSessionData, type BookedSession } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MoreVertical, Ban, ExternalLink } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function MySessionsPage() {
    const [sessions, setSessions] = useState<BookedSession[]>([])

    useEffect(() => {
        const data = getSessionData()
        if (data.bookedSessions) {
            // Sort by date, newest first
            setSessions(data.bookedSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        }
    }, [])

    const todayTimestamp = new Date().setHours(0, 0, 0, 0)
    const upcomingSessions = sessions.filter(s => new Date(s.date).getTime() >= todayTimestamp)
    const pastSessions = sessions.filter(s => new Date(s.date).getTime() < todayTimestamp)

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">My Sessions</h1>
                    <p className="text-muted-foreground font-medium">Manage your upcoming mentorship meetings.</p>
                </div>
                <Link href="/dashboard/mentorship">
                    <Button variant="outline" className="font-bold">Book New Session</Button>
                </Link>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                        Upcoming Sessions
                    </h2>

                    {upcomingSessions.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed rounded-[32px] bg-muted/10 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">No upcoming sessions</h3>
                                <p className="text-muted-foreground">You haven't booked any mentorship sessions yet.</p>
                            </div>
                            <Link href="/dashboard/mentorship">
                                <Button className="font-bold bg-[#FB923C] hover:bg-[#FB923C]/90 text-white">Find a Mentor</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {upcomingSessions.map(session => (
                                <div key={session.id} className="p-6 rounded-[32px] border bg-card shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex gap-4">
                                            <img
                                                src={session.mentorImage}
                                                alt={session.mentorName}
                                                className="w-16 h-16 rounded-2xl bg-muted object-cover border-2 border-background shadow-sm"
                                            />
                                            <div className="space-y-1">
                                                <h3 className="font-black text-lg">{session.mentorName}</h3>
                                                <div className="text-sm text-muted-foreground font-medium">
                                                    {session.mentorTitle} at <span className="text-foreground">{session.mentorCompany}</span>
                                                </div>
                                                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 font-bold">
                                                    Confirmed
                                                </Badge>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <div className="space-y-4 p-4 rounded-2xl bg-muted/30 border border-dashed mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Calendar className="w-4 h-4" />
                                                <span>Date</span>
                                            </div>
                                            <span className="font-bold">{format(new Date(session.date), "PPP")}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                                <Clock className="w-4 h-4" />
                                                <span>Time</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold">{session.time}</span>
                                                <span className="text-xs text-muted-foreground font-medium">(1 hour)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button className="flex-1 h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 gap-2" onClick={() => window.open(session.meetingLink, "_blank")}>
                                            <Video className="w-4 h-4" />
                                            Join Meeting
                                        </Button>
                                        <Button variant="outline" className="h-12 px-4 rounded-xl font-bold text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 gap-2">
                                            <Ban className="w-4 h-4" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {pastSessions.length > 0 && (
                    <div className="space-y-4 pt-8 border-t">
                        <h2 className="text-xl font-bold text-muted-foreground">Past Sessions</h2>
                        <div className="opacity-60 hover:opacity-100 transition-opacity space-y-4">
                            {pastSessions.map(session => (
                                <div key={session.id} className="flex items-center justify-between p-4 rounded-2xl border bg-muted/10">
                                    <div className="flex items-center gap-4">
                                        <img src={session.mentorImage} className="w-10 h-10 rounded-xl" />
                                        <div>
                                            <div className="font-bold">{session.mentorName}</div>
                                            <div className="text-xs font-medium text-muted-foreground">{format(new Date(session.date), "PPP")} • {session.time}</div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline" className="font-bold">View Notes</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
