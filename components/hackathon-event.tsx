"use client"

import React, { useState } from "react"
import { Trophy, Users, Clock, Star, ArrowLeft, Github, ExternalLink, MessageSquare, Flame, Zap, ShieldCheck, Crown } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Submission {
    id: string
    user: string
    title: string
    description: string
    githubUrl: string
    demoUrl: string
    upvotes: number
    score: number
    hasUpvoted?: boolean
}

interface HackathonEventProps {
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
    rules: string[]
    requirements: string[]
}

export function HackathonEvent({
    id,
    title,
    description,
    status,
    participants,
    startDate,
    endDate,
    prize,
    pattern,
    difficulty,
    rules,
    requirements
}: HackathonEventProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "submissions" | "leaderboard">("overview")
    const [isJoining, setIsJoining] = useState(false)
    const [hasJoined, setHasJoined] = useState(false)
    const [isSubmitOpen, setIsSubmitOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [urls, setUrls] = useState({ github: "", demo: "" })

    // Mock submissions data
    const submissions: Submission[] = [
        {
            id: "s1",
            user: "Alex.dev",
            title: "Zero-Latency Streamer",
            description: "A sliding window implementation optimized for 10GB/s telemetry data.",
            githubUrl: "https://github.com/alex/stream-proc",
            demoUrl: "https://demo.vercel.app",
            upvotes: 24,
            score: 92
        },
        {
            id: "s2",
            user: "Sarah_B",
            title: "Dynamic Visualizer",
            description: "Visualizing sliding window shifts in real-time using Framer Motion.",
            githubUrl: "https://github.com/sarah/viz",
            demoUrl: "https://sarah-viz.com",
            upvotes: 18,
            score: 85
        }
    ]

    // Local state for interactive upvotes
    const [submissionData, setSubmissionData] = useState<Submission[]>(submissions)

    const handleUpvote = (id: string) => {
        setSubmissionData(prev => prev.map(s => {
            if (s.id === id) {
                const isAdding = !s.hasUpvoted
                if (isAdding) {
                    toast.success("Upvoted!")
                } else {
                    toast.info("Upvote removed")
                }
                return {
                    ...s,
                    upvotes: isAdding ? s.upvotes + 1 : s.upvotes - 1,
                    hasUpvoted: isAdding
                }
            }
            return s
        }))
    }

    const handleSubmitProject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!urls.github) {
            toast.error("GitHub URL is required")
            return
        }
        setSubmitting(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitting(false)
        setIsSubmitOpen(false)
        setUrls({ github: "", demo: "" })
        toast.success("Project submitted successfully!", {
            description: "Our mentors will review your work shortly."
        })
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/hackathons">
                    <Button variant="ghost" size="sm" className="rounded-full gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Hub
                    </Button>
                </Link>
            </div>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-[#FB923C]/10 text-[#FB923C] border-none font-black uppercase tracking-widest text-[10px] py-1 px-3">
                                {status === "active" ? "Event Live" : status === "upcoming" ? "Registering" : "Event Ended"}
                            </Badge>
                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Ends in 2 Days
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9] italic">
                            {title}
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-2 border-b">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={cn(
                                "pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative",
                                activeTab === "overview" ? "text-[#FB923C]" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Overview
                            {activeTab === "overview" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FB923C] rounded-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("submissions")}
                            className={cn(
                                "pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative",
                                activeTab === "submissions" ? "text-[#FB923C]" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Submissions
                            {activeTab === "submissions" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FB923C] rounded-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTab("leaderboard")}
                            className={cn(
                                "pb-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative",
                                activeTab === "leaderboard" ? "text-[#FB923C]" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Leaderboard
                            {activeTab === "leaderboard" && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FB923C] rounded-full" />}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="pt-4">
                        {activeTab === "overview" && (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                            <ShieldCheck className="h-5 w-5 text-[#FB923C]" />
                                            Challenge Rules
                                        </h3>
                                        <ul className="space-y-3">
                                            {rules.map((rule, i) => (
                                                <li key={i} className="text-sm font-medium text-muted-foreground flex items-start gap-3">
                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FB923C] flex-shrink-0" />
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                            <Zap className="h-5 w-5 text-[#FB923C]" />
                                            Submission Requirements
                                        </h3>
                                        <ul className="space-y-3">
                                            {requirements.map((req, i) => (
                                                <li key={i} className="text-sm font-medium text-muted-foreground flex items-start gap-3">
                                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FB923C] flex-shrink-0" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-8 rounded-[40px] bg-muted/30 border border-dashed border-[#FB923C]/20 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black uppercase tracking-tight italic">Your Current Progress</h3>
                                        <Badge className="bg-[#FB923C]">Mastering {pattern}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase">
                                            <span>Blueprint Integrity</span>
                                            <span>45%</span>
                                        </div>
                                        <Progress value={45} className="h-3 rounded-full bg-white" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">Keep building to unlock higher tiers in the leaderboard.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "submissions" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Live Submissions</h3>
                                    <Button
                                        onClick={() => setIsSubmitOpen(true)}
                                        className="rounded-xl bg-[#FB923C] font-black uppercase tracking-tight"
                                    >
                                        Submit Your Project
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {submissionData.map((sub) => (
                                        <Card key={sub.id} className="p-6 rounded-[30px] border-border/50 hover:border-[#FB923C]/50 transition-all bg-card/50">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src="/assets/mentors/image.png"
                                                            alt={sub.user}
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-sm"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-black uppercase tracking-tight">{sub.user}</p>
                                                            <p className="text-[10px] text-muted-foreground">Submitted 2h ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[#FB923C]">
                                                        <Star className="h-4 w-4 fill-current" />
                                                        <span className="text-sm font-black">{sub.score}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-lg font-black uppercase tracking-tight">{sub.title}</h4>
                                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{sub.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-[10px] font-black uppercase px-2">
                                                            <Github className="h-3 w-3" /> GitHub
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-[10px] font-black uppercase px-2">
                                                            <ExternalLink className="h-3 w-3" /> Link
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        variant={sub.hasUpvoted ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handleUpvote(sub.id)}
                                                        className={cn(
                                                            "rounded-xl gap-1.5 font-black uppercase text-[10px] h-8 px-3 transition-all",
                                                            sub.hasUpvoted
                                                                ? "bg-[#FB923C] text-white hover:bg-[#FB923C]/90 border-transparent shadow-lg shadow-[#FB923C]/20"
                                                                : "hover:bg-[#FB923C]/10 hover:text-[#FB923C] border-border/50"
                                                        )}
                                                    >
                                                        <Flame className={cn("h-3.5 w-3.5", sub.hasUpvoted && "fill-current")} /> {sub.upvotes}
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "leaderboard" && (
                            <div className="space-y-8">
                                <div className="p-8 rounded-[40px] bg-gradient-to-br from-[#FB923C] to-[#FB923C]/80 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Crown className="h-32 w-32" />
                                    </div>
                                    <div className="relative z-10 grid grid-cols-3 items-end gap-4 text-center">
                                        <div className="space-y-4">
                                            <div className="w-16 h-16 rounded-full bg-white/20 mx-auto relative border-2 border-white/50 overflow-hidden">
                                                <img src="/assets/mentors/image2.png" className="w-full h-full object-cover" alt="Sarah_B" />
                                                <div className="absolute -top-2 -left-2 bg-indigo-500 text-white px-2 py-0.5 rounded-full font-black text-[10px]">#2</div>
                                            </div>
                                            <p className="font-black uppercase tracking-tight">Sarah_B</p>
                                            <div className="h-24 bg-white/10 rounded-t-2xl flex items-center justify-center font-black text-2xl">895</div>
                                        </div>
                                        <div className="space-y-4">
                                            <Crown className="h-8 w-8 text-yellow-300 mx-auto animate-bounce" />
                                            <div className="w-20 h-20 rounded-full bg-white/20 mx-auto relative border-4 border-yellow-300 overflow-hidden">
                                                <img src="/assets/mentors/image.png" className="w-full h-full object-cover" alt="Alex.dev" />
                                                <div className="absolute -top-3 -left-3 bg-yellow-300 text-[#FB923C] px-3 py-1 rounded-full font-black text-xs">#1</div>
                                            </div>
                                            <p className="text-xl font-black uppercase tracking-tight">Alex.dev</p>
                                            <div className="h-36 bg-white/20 rounded-t-2xl flex items-center justify-center font-black text-4xl shadow-lg shadow-black/10">1,240</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="w-14 h-14 rounded-full bg-white/10 mx-auto relative border-2 border-white/30 overflow-hidden">
                                                <img src="/assets/mentors/image.png" className="w-full h-full object-cover" alt="Coder_X" />
                                                <div className="absolute -top-2 -left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black text-[10px]">#3</div>
                                            </div>
                                            <p className="font-black uppercase tracking-tight">Coder_X</p>
                                            <div className="h-20 bg-white/5 rounded-t-2xl flex items-center justify-center font-black text-xl">760</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-[40px] border overflow-hidden">
                                    {["Master_Architect", "Build_Wizard", "Cloud_Native", "Kernel_Dev", "Prompt_Eng"].map((name, idx) => (
                                        <div key={name} className="flex items-center gap-6 p-6 border-b last:border-0 hover:bg-muted/30 transition-colors">
                                            <span className="w-8 text-center text-lg font-black text-muted-foreground">{idx + 4}</span>
                                            <div className="w-10 h-10 rounded-full bg-muted border-2 border-border/50 overflow-hidden">
                                                <img src={idx % 2 === 0 ? "/assets/mentors/image.png" : "/assets/mentors/image2.png"} alt={name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-black uppercase tracking-tight">{name}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold">{10 - idx} Submissions Verified</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-[#FB923C]">{700 - (idx * 50)} PTS</p>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{idx < 2 ? "Gold" : "Silver"} Tier</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <Card className="p-8 rounded-[40px] space-y-6 bg-card/50 backdrop-blur-sm shadow-xl border-border/50">
                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Prize Pool</p>
                            <h3 className="text-3xl font-black text-[#FB923C] tracking-tighter italic uppercase">{prize}</h3>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Participants</span>
                                <span className="text-sm font-black">{participants} Engineers</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Difficulty</span>
                                <Badge variant="outline" className="rounded-full border-[#FB923C] text-[#FB923C] font-black uppercase text-[10px]">{difficulty}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Pattern</span>
                                <span className="text-sm font-black p-1 bg-muted rounded-md">{pattern}</span>
                            </div>
                        </div>
                        <div className="pt-4">
                            {!hasJoined ? (
                                <Button
                                    onClick={() => {
                                        setIsJoining(true)
                                        setTimeout(() => {
                                            setIsJoining(false)
                                            setHasJoined(true)
                                            toast.success("Successfully registered!", {
                                                description: "You can now start building and submit your project.",
                                            })
                                        }, 1000)
                                    }}
                                    disabled={isJoining}
                                    className="w-full h-16 rounded-2xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-white font-black uppercase tracking-tight text-lg shadow-2xl shadow-[#FB923C]/30"
                                >
                                    {isJoining ? "Registering..." : "Join this Sprint"}
                                </Button>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-3">
                                        <Zap className="h-5 w-5 fill-current" />
                                        <p className="text-xs font-black uppercase tracking-tighter">You're in! Start Building.</p>
                                    </div>
                                    <Button
                                        onClick={() => setIsSubmitOpen(true)}
                                        className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-tight text-lg"
                                    >
                                        Submit Code
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    <div className="p-8 rounded-[40px] border space-y-4 bg-muted/20">
                        <h4 className="text-sm font-black uppercase tracking-tight italic">Timeline</h4>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-[#FB923C] z-10 relative" />
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-border" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase leading-none">Registration Opens</p>
                                    <p className="text-[10px] text-muted-foreground">{startDate}</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-[#FB923C] z-10 relative" />
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-border" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase leading-none">Hacking Starts</p>
                                    <p className="text-[10px] text-muted-foreground">{startDate} • 09:00 AM</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <div className="w-3 h-3 rounded-full bg-border z-10 relative" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase leading-none">Judging Ends</p>
                                    <p className="text-[10px] text-muted-foreground">{endDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] border-border/50 shadow-2xl">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">Submit Your Project</DialogTitle>
                        <DialogDescription className="font-medium text-sm">
                            Ready to ship? Provide your project links below to complete your submission for <span className="text-[#FB923C] font-bold">{title}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitProject} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="github" className="text-xs font-black uppercase tracking-wider text-muted-foreground">GitHub Repository URL</Label>
                                <Input
                                    id="github"
                                    placeholder="https://github.com/username/repo"
                                    value={urls.github}
                                    onChange={(e) => setUrls(prev => ({ ...prev, github: e.target.value }))}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:ring-[#FB923C] focus:border-[#FB923C] font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="demo" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Live Demo URL (Optional)</Label>
                                <Input
                                    id="demo"
                                    placeholder="https://project-demo.vercel.app"
                                    value={urls.demo}
                                    onChange={(e) => setUrls(prev => ({ ...prev, demo: e.target.value }))}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:ring-[#FB923C] focus:border-[#FB923C] font-medium"
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsSubmitOpen(false)}
                                className="font-bold uppercase tracking-tight rounded-xl"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#FB923C] hover:bg-[#FB923C]/90 text-white font-black uppercase tracking-tight px-8 h-12 rounded-xl shadow-lg shadow-[#FB923C]/20"
                            >
                                {submitting ? "Submitting..." : "Submit Project"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
