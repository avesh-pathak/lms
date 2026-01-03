"use client"

import React, { useState } from "react"
import Link from "next/link"
import { MOCK_SQUADS } from "@/lib/data/groups"
import {
    Users,
    Zap,
    ArrowRight,
    ShieldCheck,
    Sparkles,
    Search,
    Filter,
    Clock,
    Flame
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function GroupsPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredSquads = MOCK_SQUADS.filter(squad =>
        squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        squad.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        squad.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Grid & Globs */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20" />

            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-[128px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-orange-500/5 rounded-full blur-[128px] animate-pulse pointer-events-none delay-1000" />

            <div className="relative z-10 p-4 lg:p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col space-y-3">
                    <div className="inline-flex items-center gap-2 px-2 py-1 w-fit rounded-full bg-primary/5 border border-primary/10">
                        <Users className="h-3 w-3 text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">Neural Coalitions Active</span>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.8] italic">
                            Exclusive <span className="text-primary italic">Squads.</span>
                        </h1>
                        <p className="text-muted-foreground font-bold text-sm leading-relaxed opacity-70 max-w-2xl italic">
                            Join elite mentor-led coalitions for high-bandwidth technical guidance and community accountability.
                        </p>
                    </div>
                </div>

                {/* Filters Area */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-card/40 backdrop-blur-xl p-4 rounded-[32px] border-2 border-border/50">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-40" />
                        <Input
                            placeholder="Find your squad (e.g., System Design, Frontend)..."
                            className="pl-12 h-12 rounded-2xl bg-background border-none text-sm font-bold shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] border-2">
                            <Filter className="h-4 w-4 mr-2" /> Filter Frequency
                        </Button>
                    </div>
                </div>

                {/* Squads Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredSquads.map((squad) => (
                        <Link key={squad.id} href={`/dashboard/groups/${squad.id}`} className="group">
                            <Card className="h-full relative overflow-hidden flex flex-col p-8 rounded-[48px] border-2 border-border/50 bg-card/60 backdrop-blur-xl hover:border-primary/50 hover:bg-card/80 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-500">
                                {/* Background Glow */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[100px] -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />

                                <div className="space-y-6 relative z-10 flex-1">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/10 font-black text-[9px] uppercase tracking-widest italic">
                                            {squad.category}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-[10px] font-black italic text-muted-foreground/60 uppercase">
                                            <Users className="w-3 h-3" /> {squad.memberCount}/{squad.maxMembers}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">{squad.name}</h3>
                                        <p className="text-xs font-bold text-muted-foreground/80 leading-relaxed line-clamp-2 italic">
                                            {squad.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 py-4 border-y border-dashed border-border/50">
                                        <img src={squad.mentorImage} alt={squad.mentorName} className="w-10 h-10 rounded-2xl object-cover border-2 border-background shadow-lg" />
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black uppercase tracking-tighter italic">{squad.mentorName}</p>
                                            <p className="text-[8px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{squad.mentorTitle} @ {squad.mentorCompany}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-widest italic text-muted-foreground/80">Next Sync: {squad.nextSession}</span>
                                        </div>
                                        <div className="p-4 rounded-3xl bg-muted/30 border-2 border-border/50 space-y-2 group-hover:bg-muted/50 transition-colors">
                                            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/60 italic">Subscription Node</div>
                                            <div className="text-2xl font-black italic tracking-tighter">₹{squad.monthlyPrice}<span className="text-[10px] text-muted-foreground/60 tracking-normal ml-1">/ month</span></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 relative z-10">
                                    <Button className="w-full h-14 rounded-2xl font-black italic uppercase tracking-[0.2em] text-[10px] bg-foreground text-background group-hover:bg-primary group-hover:text-white shadow-xl shadow-primary/10 transition-all active:scale-95">
                                        Join the Coalition <Zap className="ml-2 h-4 w-4 fill-current" />
                                    </Button>
                                </div>

                                {squad.status === "starting-soon" && (
                                    <div className="absolute top-12 -right-12 rotate-45 bg-orange-500 text-white px-12 py-1 text-[8px] font-black uppercase tracking-[0.3em] shadow-lg">
                                        Establishing...
                                    </div>
                                )}
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Bottom Guarantee */}
                <div className="max-w-xl mx-auto p-8 rounded-[40px] bg-emerald-500/[0.03] border-2 border-emerald-500/10 text-center space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20" />
                    <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-black text-[12px] uppercase tracking-[0.3em] italic">The Collective Guarantee</span>
                    </div>
                    <p className="text-xs text-emerald-900/60 dark:text-emerald-100/60 font-bold italic leading-relaxed">
                        If your Squad doesn't accelerate your technical intuition in the first 14 days, we will terminate your subscription and issue an <span className="text-emerald-600 dark:text-emerald-400 font-black">ENTIRE REFUND</span>. No neural friction.
                    </p>
                </div>
            </div>
        </div>
    )
}
