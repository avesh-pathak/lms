"use client"

import React from "react"
import { Trophy, Users, Star, ArrowRight, Search, Filter, Rocket, Zap, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HackathonCard } from "./hackathon-card"

export function HackathonHub() {
    const hackathons = [
        {
            id: "1",
            title: "The Sliding Window Sprint",
            description: "Build a high-performance analytics dashboard that processes streaming data using the Sliding Window pattern.",
            status: "active" as const,
            participants: 142,
            startDate: "Oct 24",
            endDate: "Oct 26",
            prize: "$500 + Babua Pro",
            pattern: "Sliding Window",
            difficulty: "Intermediate" as const,
            progress: 65
        },
        {
            id: "2",
            title: "System Design: Scalable Cache",
            description: "Design and implement a distributed caching layer with LRU eviction and Write-through policies.",
            status: "active" as const,
            participants: 89,
            startDate: "Oct 25",
            endDate: "Oct 27",
            prize: "Interview with Top VC",
            pattern: "Caching",
            difficulty: "Advanced" as const,
            progress: 0
        },
        {
            id: "3",
            title: "LLD: Banking System",
            description: "Create a thread-safe banking system with support for transactions, audits, and interest calculations.",
            status: "upcoming" as const,
            participants: 256,
            startDate: "Nov 01",
            endDate: "Nov 03",
            prize: "Engineering Kit",
            pattern: "Command Pattern",
            difficulty: "Beginner" as const
        },
        {
            id: "4",
            title: "AI Agent Builder",
            description: "Build an autonomous agent that can solve multi-step engineering tasks using LLM tool use.",
            status: "upcoming" as const,
            participants: 512,
            startDate: "Nov 05",
            endDate: "Nov 10",
            prize: "$1000 API Credits",
            pattern: "ReAct Agents",
            difficulty: "Advanced" as const
        }
    ]

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[40px] bg-[#FB923C] p-12 text-white">
                <div className="absolute top-0 right-0 p-12 opacity-10 blur-sm">
                    <Trophy className="h-64 w-64" />
                </div>
                <div className="relative z-10 max-w-2xl space-y-6">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 font-black uppercase tracking-widest py-1 px-4 rounded-full">
                        Babua Arena
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">
                        BUILD FAST. <br />
                        WIN <span className="underline decoration-4 underline-offset-8">REAL</span> REWARDS.
                    </h1>
                    <p className="text-lg font-bold opacity-90 leading-relaxed">
                        Transform your learning into production-grade projects. Compete with top engineers, build your proof-of-work, and win exclusive mentorship and prizes.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <Button size="lg" className="bg-white text-[#FB923C] hover:bg-white/90 h-14 px-8 rounded-2xl font-black uppercase tracking-tight shadow-2xl">
                            Join Active sprint
                        </Button>
                        <div className="flex items-center gap-3 px-4 py-2 bg-black/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-[#FB923C]" />)}
                            </div>
                            <span className="text-sm font-black uppercase tracking-tighter">1,240 Building Now</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search sprints..." className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:border-[#FB923C]/50 transition-all font-bold" />
                    </div>
                    <Button variant="outline" className="h-12 w-12 rounded-2xl shrink-0 p-0 border-border/50">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    <Badge className="bg-[#FB923C] text-white rounded-xl py-2 px-6 font-black uppercase tracking-tight cursor-pointer">All Sprints</Badge>
                    <Badge variant="outline" className="rounded-xl py-2 px-6 font-black uppercase tracking-tight cursor-pointer hover:bg-accent hover:text-accent-foreground border-border/50">Active</Badge>
                    <Badge variant="outline" className="rounded-xl py-2 px-6 font-black uppercase tracking-tight cursor-pointer hover:bg-accent hover:text-accent-foreground border-border/50">Upcoming</Badge>
                    <Badge variant="outline" className="rounded-xl py-2 px-6 font-black uppercase tracking-tight cursor-pointer hover:bg-accent hover:text-accent-foreground border-border/50">Hall of Fame</Badge>
                </div>
            </div>

            {/* Featured Hackathon Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} {...hackathon} />
                ))}
            </div>

            {/* Why Build? Extra Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-8 rounded-[40px] border bg-card/50 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Crown className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Recruiter Visibility</h4>
                    <p className="text-sm text-muted-foreground font-bold leading-relaxed">Top submissions are directly shared with our partner network of deep-tech startups and VC firms.</p>
                </div>
                <div className="p-8 rounded-[40px] border bg-card/50 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Production Skills</h4>
                    <p className="text-sm text-muted-foreground font-bold leading-relaxed">Move beyond LeetCode. Build services with actual throughput, error handling, and latency requirements.</p>
                </div>
                <div className="p-8 rounded-[40px] border bg-card/50 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FB923C]/10 flex items-center justify-center text-[#FB923C]">
                        <Zap className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tight">Peer Review</h4>
                    <p className="text-sm text-muted-foreground font-bold leading-relaxed">Get your code roasted and improved by senior engineers in the Babua community.</p>
                </div>
            </div>
        </div>
    )
}
