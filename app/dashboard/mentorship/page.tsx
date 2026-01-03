"use client"

import React, { useState } from "react"
import Link from "next/link"
import { MOCK_MENTORS } from "@/lib/data/mentors"
import { MentorCard } from "@/components/mentor-card"
import { UpcomingSessions } from "@/components/upcoming-sessions"
import {
    Search,
    Filter,
    Sparkles,
    Radio,
    Flame,
    Zap,
    Clock,
    ChevronUp,
    ChevronDown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toSlug } from "@/lib/utils"

export default function MentorshipPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isMissionControlOpen, setIsMissionControlOpen] = useState(true)

    const filteredMentors = React.useMemo(() => MOCK_MENTORS.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [searchTerm])

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Grid & Globs */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[64px] pointer-events-none" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-orange-500/5 rounded-full blur-[64px] pointer-events-none" />

            <div className="relative z-10 p-4 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
                {/* Tagline Section */}
                <div className="flex flex-col space-y-1.5 pt-2">
                    <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 w-fit rounded-full bg-orange-500/5 border border-orange-500/10">
                        <Sparkles className="h-2.5 w-2.5 text-orange-500" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-orange-500 italic">Babua Premier Support</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-[0.9] italic">
                        Mastery Requires <span className="text-orange-500 italic">Mentorship.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-xs leading-relaxed opacity-80">
                        Access secondary support modules for rapid technical throughput.
                    </p>
                </div>

                {/* UPCOMING SESSIONS / MY SESSIONS */}
                <UpcomingSessions />

                {/* 4 Support Module Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* TRANSMITTER SOS */}
                    <Card className="group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-[32px] border-border/50 bg-card hover:border-red-500/50 transition-all duration-500">
                        <div className="h-12 w-12 rounded-2xl bg-red-500 text-white flex items-center justify-center mb-4 shadow-xl shadow-red-500/20 relative z-10 transition-transform group-hover:scale-110">
                            <Radio className="h-5 w-5 animate-pulse" />
                        </div>
                        <div className="space-y-1 relative z-10 flex-1">
                            <h3 className="text-sm font-black italic uppercase tracking-tighter">Transmitter SOS</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/80 leading-relaxed px-2">
                                Critical code blocker resolution in &lt; 24h terminal time.
                            </p>
                        </div>
                        <div className="mt-5 w-full relative z-10 px-2">
                            <Button variant="outline" className="w-full h-9 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black italic uppercase tracking-widest text-[8px] transition-all">
                                Broadcast (₹299)
                            </Button>
                        </div>
                    </Card>

                    {/* CLINICAL ROAST */}
                    <Card className="group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-[32px] border-border/50 bg-card hover:border-orange-500/50 transition-all duration-500">
                        <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-xl shadow-orange-500/20 relative z-10 transition-transform group-hover:scale-110">
                            <Flame className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 relative z-10 flex-1">
                            <h3 className="text-sm font-black italic uppercase tracking-tighter">Clinical Roast</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/80 leading-relaxed px-2">
                                Aggressive resume/code audit by senior engineering leads.
                            </p>
                        </div>
                        <div className="mt-5 w-full relative z-10 px-2">
                            <Link href="/dashboard/roast" className="w-full">
                                <Button variant="outline" className="w-full h-9 rounded-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-black italic uppercase tracking-widest text-[8px] transition-all">
                                    Roast (₹199)
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* FLASH CONSULT */}
                    <Card className="group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-[32px] border-border/50 bg-card hover:border-indigo-500/50 transition-all duration-500">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/20 relative z-10 transition-transform group-hover:scale-110">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 relative z-10 flex-1">
                            <h3 className="text-sm font-black italic uppercase tracking-tighter">Flash Consult</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/80 leading-relaxed px-2">
                                Rapid 15m tech/career situational awareness guidance.
                            </p>
                        </div>
                        <div className="mt-5 w-full relative z-10 px-2">
                            <Button variant="outline" className="w-full h-9 rounded-lg border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white font-black italic uppercase tracking-widest text-[8px] transition-all">
                                Consult (₹149)
                            </Button>
                        </div>
                    </Card>

                    {/* 1-HOUR MISSION CONTROL */}
                    <Card
                        className={`group relative overflow-hidden flex flex-col items-center text-center p-6 rounded-[32px] border-2 transition-all duration-500 cursor-pointer ${isMissionControlOpen ? 'border-emerald-500 bg-emerald-500/[0.02] shadow-2xl shadow-emerald-500/20' : 'border-border/50 bg-card hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10'}`}
                        onClick={() => setIsMissionControlOpen(!isMissionControlOpen)}
                    >
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/20 relative z-10 transition-transform group-hover:scale-110">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div className="space-y-1 relative z-10 flex-1">
                            <h3 className="text-sm font-black italic uppercase tracking-tighter">Mission Control</h3>
                            <p className="text-[10px] font-bold text-muted-foreground/80 leading-relaxed px-2">
                                1h deep-dive and high-level architectural planning.
                            </p>
                        </div>
                        <div className="mt-5 w-full relative z-10 px-2">
                            <Button variant={isMissionControlOpen ? "default" : "outline"} className={`w-full h-9 rounded-lg font-black italic uppercase tracking-widest text-[8px] transition-all ${isMissionControlOpen ? 'bg-emerald-500 text-white border-0 hover:bg-emerald-600' : 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                                {isMissionControlOpen ? "Active View" : "1-Hour (₹499)"}
                                {isMissionControlOpen ? <ChevronUp className="ml-1.5 h-3 w-3" /> : <ChevronDown className="ml-1.5 h-3 w-3" />}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* MISSION CONTROL CENTER */}
                {isMissionControlOpen && (
                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 border-t border-emerald-500/10 pt-6">
                            <div className="space-y-1">
                                <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Mission Control Center</h2>
                                <p className="text-muted-foreground font-medium text-xs leading-relaxed opacity-60">
                                    Select an elite mentor to initialize a high-bandwidth technical session.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 w-full lg:w-auto">
                                <div className="relative flex-1 lg:w-[240px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-40" />
                                    <Input
                                        placeholder="Search experts..."
                                        className="pl-9 h-10 rounded-xl bg-white border-border/40 text-xs font-medium shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" className="h-10 w-10 rounded-xl shrink-0 border-border/40 hover:bg-muted p-0">
                                    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-20">
                            {filteredMentors.map(mentor => (
                                <MentorCard
                                    key={mentor.id}
                                    mentor={mentor}
                                />
                            ))}
                        </div>

                        {filteredMentors.length === 0 && (
                            <div className="text-center py-12 bg-muted/20 rounded-[48px] border border-dashed border-border/50">
                                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px] opacity-40 italic">No experts found in this frequency.</p>
                                <Button
                                    variant="link"
                                    onClick={() => setSearchTerm("")}
                                    className="text-orange-500 text-xs font-bold mt-2"
                                >
                                    Clear filters
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
