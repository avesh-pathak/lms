"use client"

import React, { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trophy, Users, Star, ArrowRight, Search, Filter, Rocket, Zap, Crown, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HackathonCard } from "./hackathon-card"
import { MOCK_HACKATHONS, MOCK_HALL_OF_FAME, type LegendaryProject } from "@/lib/data/hackathons"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function HackathonHub() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState<"All" | "Active" | "Upcoming" | "Hall of Fame">("All")
    const [selectedProject, setSelectedProject] = useState<LegendaryProject | null>(null)

    const filteredHackathons = useMemo(() => {
        return MOCK_HACKATHONS.filter(h => {
            const matchesSearch = h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                h.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesTab = activeTab === "All" ? true :
                activeTab === "Active" ? h.status === "active" :
                    h.status === "upcoming"

            return matchesSearch && matchesTab
        })
    }, [searchTerm, activeTab])

    const filteredHallOfFame = useMemo(() => {
        return MOCK_HALL_OF_FAME.filter(p =>
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.builder.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.techStack.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    }, [searchTerm])

    const tabs = ["All", "Active", "Upcoming", "Hall of Fame"] as const

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#FB923C] to-[#EA580C] dark:from-[#FB923C]/20 dark:to-orange-950/20 p-5 md:p-6 text-white shadow-xl shadow-orange-500/20 dark:shadow-none border border-white/10 dark:border-orange-500/20 backdrop-blur-md">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 blur-[80px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-black/10 blur-[60px] rounded-full" />

                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy className="h-24 w-24 rotate-12" />
                </div>

                <div className="relative z-10 max-w-xl space-y-2">
                    <div className="flex items-center gap-2">
                        <Badge className="bg-white/20 hover:bg-white/30 dark:bg-orange-500/20 dark:hover:bg-orange-500/30 text-white dark:text-[#FB923C] border-none font-black uppercase tracking-widest py-0.5 px-2.5 rounded-full text-[9px] backdrop-blur-md">
                            Babua Arena
                        </Badge>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/5 border border-white/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                            <span className="text-white/80 dark:text-white/60 font-black text-[9px] uppercase tracking-wider">Season 1 LIVE</span>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-none italic">
                        BUILD FAST. <br />
                        WIN <span className="text-black dark:text-[#FB923C] relative">REAL
                            <div className="absolute -bottom-1 left-0 w-full h-2 bg-black/10 dark:bg-[#FB923C]/10 -z-10 -skew-x-12" />
                        </span> REWARDS.
                    </h1>

                    <p className="text-xs md:text-sm font-bold opacity-90 dark:opacity-80 leading-relaxed max-w-md">
                        Transform your learning into production-grade projects. Win exclusive mentorship and prizes.
                    </p>

                    <div className="flex gap-3 pt-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                const activeId = MOCK_HACKATHONS.find(h => h.status === "active")?.id || "1"
                                router.push(`/dashboard/hackathons/${activeId}`)
                            }}
                            className="bg-white text-[#FB923C] hover:bg-white/90 dark:bg-[#FB923C] dark:text-white dark:hover:bg-[#FB923C]/90 h-9 px-5 rounded-lg font-black uppercase tracking-tight shadow-md text-[10px] border-none"
                        >
                            Join Active Sprint <Rocket className="ml-2 h-3.5 w-3.5" />
                        </Button>
                        <div className="flex items-center gap-2 px-3 py-1 bg-black/10 dark:bg-white/5 rounded-lg border border-white/20 backdrop-blur-xl">
                            <div className="flex -space-x-1.5">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-[#FB923C] dark:border-orange-500/50 shadow-sm" />
                                ))}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter text-white whitespace-nowrap">1,240 Building</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search sprints..."
                            className="pl-12 h-12 rounded-2xl bg-card border-border/50 focus:border-[#FB923C]/50 transition-all font-bold"
                        />
                    </div>
                    <Button variant="outline" className="h-12 w-12 rounded-2xl shrink-0 p-0 border-border/50">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
                    {tabs.map(tab => (
                        <Badge
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            variant={activeTab === tab ? "default" : "outline"}
                            className={cn(
                                "rounded-xl py-2 px-6 font-black uppercase tracking-tight cursor-pointer transition-all",
                                activeTab === tab
                                    ? "bg-[#FB923C] text-white hover:bg-[#FB923C]/90"
                                    : "hover:bg-accent hover:text-accent-foreground border-border/50"
                            )}
                        >
                            {tab === "All" ? "All Sprints" : tab}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Feature Content */}
            {activeTab === "Hall of Fame" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredHallOfFame.map((project) => (
                        <Card
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className="group relative overflow-hidden rounded-[32px] border-2 border-border/50 bg-card hover:border-[#FB923C]/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FB923C]/10"
                        >
                            <div className="p-8 pb-0 flex items-center justify-between">
                                <Badge className="bg-yellow-400 text-black border-0 font-black uppercase text-[10px]">Legendary Entry</Badge>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                        <Users className="h-3 w-3 text-indigo-500" />
                                    </div>
                                    <span className="text-muted-foreground font-black uppercase text-[9px] tracking-tight">{project.builder}</span>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-[#FB923C] tracking-widest">{project.hackathonTitle}</p>
                                    <h4 className="text-xl font-black uppercase tracking-tight">{project.title}</h4>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {project.techStack.map(tech => (
                                        <Badge key={tech} variant="secondary" className="text-[8px] font-black uppercase bg-muted/50 border-0">{tech}</Badge>
                                    ))}
                                </div>
                                <p className="text-xs font-medium text-muted-foreground line-clamp-2">{project.description}</p>
                                <div className="pt-2 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase text-indigo-500">View Case Study</span>
                                    <ArrowRight className="h-4 w-4 text-indigo-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredHackathons.map((hackathon) => (
                        <HackathonCard
                            key={hackathon.id}
                            {...hackathon}
                            onClick={() => {
                                if (hackathon.status === "active") {
                                    router.push(`/dashboard/hackathons/${hackathon.id}`)
                                } else {
                                    toast.success(`Added to ${hackathon.title} waitlist!`, {
                                        description: "We'll notify you when registration opens.",
                                    })
                                }
                            }}
                        />
                    ))}
                    {filteredHackathons.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground font-bold">
                            No sprints found matching your search.
                        </div>
                    )}
                </div>
            )}

            {/* Case Study Modal */}
            <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 rounded-[40px] shadow-2xl">
                    {selectedProject && (
                        <div className="flex flex-col h-full bg-card">
                            <div className="p-10 pb-0 bg-gradient-to-br from-indigo-600/10 to-[#FB923C]/10 border-b border-border/50">
                                <div className="flex items-center justify-between gap-6 pb-10">
                                    <div className="space-y-3">
                                        <Badge className="bg-[#FB923C] text-white border-0 font-black uppercase text-[10px] tracking-widest">{selectedProject.hackathonTitle}</Badge>
                                        <DialogTitle className="text-5xl font-black text-foreground uppercase tracking-tighter italic leading-none">
                                            {selectedProject.title}
                                        </DialogTitle>
                                    </div>
                                    <div className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border/50 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <div className="pr-2">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">Architect</p>
                                            <p className="text-sm font-black text-foreground uppercase">{selectedProject.builder}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#FB923C]">
                                                <Rocket className="h-4 w-4" />
                                                Languages & Tech
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.techStack.map(tech => (
                                                    <Badge key={tech} className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 font-black uppercase text-[10px] px-3 py-1">
                                                        {tech}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-[#FB923C]">
                                                <Star className="h-4 w-4" />
                                                Project Mission
                                            </h3>
                                            <DialogDescription className="text-sm font-bold text-muted-foreground leading-relaxed italic border-l-4 border-indigo-500/30 pl-4">
                                                "{selectedProject.description}"
                                            </DialogDescription>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#FB923C]/5 to-indigo-500/5 border border-border/50 space-y-4 shadow-inner">
                                        <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2 text-indigo-500">
                                            <Crown className="h-4 w-4" />
                                            Why this Won
                                        </h3>
                                        <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
                                            {selectedProject.mentorJustification}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <Button
                                        onClick={() => window.open(selectedProject.githubUrl, "_blank")}
                                        className="flex-1 h-14 rounded-2xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-tight shadow-xl shadow-black/10"
                                    >
                                        <Github className="mr-2 h-5 w-5" /> Inspect Code
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(selectedProject.demoUrl, "_blank")}
                                        className="flex-1 h-14 rounded-2xl border-2 border-border/50 font-black uppercase tracking-tight"
                                    >
                                        <Zap className="mr-2 h-5 w-5 text-[#FB923C]" /> Watch Demo
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* How to Compete Section */}
            <div className="space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-3xl font-black uppercase tracking-tight italic">How to Compete</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Follow these steps to claim your bounty</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { step: "01", title: "Select Sprint", desc: "Choose an active hackathon that matches your skill level." },
                        { step: "02", title: "Build Blueprint", desc: "Solve the challenge and build a production-grade project." },
                        { step: "03", title: "Submit Work", desc: "Share your GitHub repo and live demo URL for review." },
                        { step: "04", title: "Win Rewards", desc: "Get upvoted and verified by mentors to win prizes." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 md:p-10 rounded-[32px] bg-muted/30 border border-dashed text-center space-y-4 font-sans hover:bg-muted/50 transition-all hover:-translate-y-1">
                            <div className="text-4xl font-black text-[#FB923C]/30 italic leading-none">{item.step}</div>
                            <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
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
