"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, Trophy, Code2, Layers, Zap, Star, ShieldCheck, Cpu, PencilRuler, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toSlug, cn } from "@/lib/utils"
// Note: We use the local types
import type { Topic } from "@/lib/types"
import { useProblems } from "@/components/problems-provider"

interface LandingPageProps {
    topics: Topic[]
}

export function LandingPage({ topics }: LandingPageProps) {
    const { problems } = useProblems()

    // Calculate stats
    const totalProblems = 20
    const solvedProblems = problems ? problems.filter(p => p.status === "Completed").length : 0
    const progress = Math.min(Math.round((solvedProblems / totalProblems) * 100), 100)

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-[#FB923C] flex items-center justify-center">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-black text-xl tracking-tighter uppercase">Babua LMS</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                        <a href="#paths" className="hover:text-[#FB923C] transition-colors">Paths</a>
                        <a href="#mentor" className="hover:text-[#FB923C] transition-colors">Mentorship</a>
                        <a href="#proof-of-work-detail" className="hover:text-[#FB923C] transition-colors">Proof of Work</a>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="default" className="rounded-full px-6 font-bold shadow-lg shadow-[#FB923C]/20 hover:scale-105 transition-all">
                            Launch Hub
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />

                <div className="max-w-7xl mx-auto px-6 text-center space-y-8">

                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] max-w-5xl mx-auto uppercase">
                        REAL ENGINEERING <br />
                        NOT JUST <span className="text-[#FB923C] italic underline decoration-4 underline-offset-8">CERTIFICATES</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                        Master the core <span className="text-foreground font-bold">PATTERNS</span> of Data Structures, System Design, and Core Engineering. Practical, free, and community-driven education for the modern engineer.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-16 px-10 rounded-full text-xl font-black uppercase tracking-tight shadow-2xl shadow-[#FB923C]/30 group bg-[#FB923C] text-white hover:bg-[#FB923C]/90">
                                Start Training Free
                                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <a href="#paths">
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-full text-xl font-bold border-muted-foreground/20 hover:bg-muted/50 transition-all">
                                Explore All Paths
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* What we offer - Domain Grid - MOVED UP */}
            <section id="paths" className="py-24 bg-background">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center space-y-4 mb-20">
                        <Badge variant="outline" className="py-2 px-6 rounded-full border-[#FB923C]/20 bg-[#FB923C]/5 text-[#FB923C] font-black uppercase tracking-[0.2em] text-xs">
                            The Babua Curriculum
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">ENGINEERING PATHS</h2>
                        <div className="space-y-2 max-w-2xl mx-auto">
                            <p className="text-muted-foreground text-lg font-medium italic">"Build systems, not just code. Master the architecture of the future."</p>
                            <p className="text-muted-foreground text-sm font-medium">From binary to distributed systems, we cover the full stack of engineering wisdom.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* DSA Path */}
                        <div className="group p-8 rounded-[40px] border bg-card hover:border-[#FB923C] transition-all hover:-translate-y-2 relative overflow-hidden hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                                <Code2 className="h-20 w-20 text-[#FB923C]" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">DSA Patterns</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">Sliding Window • Graphs • DP</p>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Master the intuition behind 20+ DSA patterns. Solve problems by pattern, not by rote memorization.</p>
                                <Link href="/dashboard" className="block w-full">
                                    <Button variant="outline" className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-white transition-all font-bold uppercase tracking-tight">Start Training</Button>
                                </Link>
                            </div>
                        </div>

                        {/* System Design Path */}
                        <div className="group p-8 rounded-[40px] border bg-card hover:border-[#FB923C] transition-all hover:-translate-y-2 relative overflow-hidden hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                                <Layers className="h-20 w-20 text-[#FB923C]" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">System Design</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">Scalability • Caching • Queues</p>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">From Load Balancers to Microservices. Learn how to architect systems that scale to millions.</p>
                                <Button variant="outline" className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-white transition-all font-bold uppercase tracking-tight">Explore Systems</Button>
                            </div>
                        </div>

                        {/* LLD Path */}
                        <div className="group p-8 rounded-[40px] border bg-card hover:border-[#FB923C] transition-all hover:-translate-y-2 relative overflow-hidden hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                                <PencilRuler className="h-20 w-20 text-[#FB923C]" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Low Level Design</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">SOLID • Design Patterns • OOPS</p>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Write clean, maintainable, and extensible code. Master the patterns that separate juniors from seniors.</p>
                                <Button variant="outline" className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-white transition-all font-bold uppercase tracking-tight">Master Design</Button>
                            </div>
                        </div>

                        {/* Core Engineering Path */}
                        <div className="group p-8 rounded-[40px] border bg-card hover:border-[#FB923C] transition-all hover:-translate-y-2 relative overflow-hidden hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                                <Cpu className="h-20 w-20 text-[#FB923C]" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Core Engineering</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">OS • DBMS • Networks</p>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Under the hood. Understand how kernels work, how DBs index data, and how packets flow.</p>
                                <Button variant="outline" className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-white transition-all font-bold uppercase tracking-tight">Build Core</Button>
                            </div>
                        </div>

                        {/* AI / ML Path */}
                        <div className="group p-8 rounded-[40px] border bg-card hover:border-[#FB923C] transition-all hover:-translate-y-2 relative overflow-hidden hover:shadow-xl">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                                <Zap className="h-20 w-20 text-[#FB923C]" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">AI Fundamentals</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic underline decoration-[#FB923C]/30 underline-offset-4">LLMs • Prompt Eng • Applied AI</p>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">The practical guide to AI. Build and integrate intelligence into your applications today.</p>
                                <Button variant="outline" className="w-full rounded-2xl group-hover:bg-[#FB923C] group-hover:text-white transition-all font-bold uppercase tracking-tight">Master AI</Button>
                            </div>
                        </div>

                        {/* Proof of Work Card */}
                        <div className="group p-8 rounded-[40px] border-2 border-dashed border-[#FB923C]/30 bg-[#FB923C]/5 hover:border-[#FB923C] transition-all hover:-translate-y-2 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <Star className="h-20 w-20 text-[#FB923C]" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Proof of Work</h3>
                                    <p className="text-sm text-muted-foreground font-medium italic text-[#FB923C]">Your Engineering Legacy</p>
                                </div>
                                <p className="text-muted-foreground text-sm font-medium">Forget PDFs. Your public "Babua Profile" live-tracks your solved patterns and real building growth.</p>
                                <Link href="/dashboard/analytics">
                                    <Button variant="outline" className="w-full rounded-2xl border-[#FB923C] text-[#FB923C] hover:bg-[#FB923C] hover:text-white transition-all font-bold uppercase tracking-tight">View Registry</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Features */}
            <section className="py-24 border-y bg-muted/30 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Unified Hub Card */}
                    <div className="group p-10 rounded-[40px] border bg-card hover:border-[#FB923C]/50 transition-all hover:-translate-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Zap className="h-24 w-24 text-[#FB923C]" />
                        </div>
                        <div className="space-y-4 relative">
                            <div className="w-14 h-14 rounded-3xl bg-[#FB923C]/10 flex items-center justify-center text-[#FB923C] border border-[#FB923C]/20">
                                <Zap className="h-7 w-7" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight uppercase italic">Unified Hub</h3>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">One dashboard for all engineering growth. Track every domain without friction.</p>
                        </div>
                    </div>

                    {/* Pattern First Card */}
                    <div className="group p-10 rounded-[40px] border bg-card hover:border-emerald-500/50 transition-all hover:-translate-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Layers className="h-24 w-24 text-emerald-500" />
                        </div>
                        <div className="space-y-4 relative">
                            <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                <Layers className="h-7 w-7" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight uppercase italic">Pattern First</h3>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">Master the logic, not the solution. Our pattern-based approach builds real intuition.</p>
                        </div>
                    </div>

                    {/* No Certificates Card */}
                    <div className="group p-10 rounded-[40px] border bg-card hover:border-indigo-500/50 transition-all hover:-translate-y-2 relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-24 w-24 text-indigo-500" />
                        </div>
                        <div className="space-y-4 relative">
                            <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight uppercase italic">No Certificates</h3>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">We log your Proof of Work. Build a public profile that top recruiters actually trust.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Proof of Work - Highlight Section */}
            <section id="proof-of-work-detail" className="py-32 border-t relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="rounded-[40px] border bg-card p-1 relative overflow-hidden group shadow-2xl">
                            <div className="bg-background rounded-[38px] p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black uppercase tracking-widest text-[#FB923C] text-sm italic">Proof of Work Registry</h4>
                                    <div className="px-3 py-1 bg-[#FB923C]/10 text-[#FB923C] rounded-full text-[10px] font-black tracking-tighter uppercase">Verified Profile</div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-muted overflow-hidden border-2 border-[#FB923C]/20">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" alt="User" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold text-lg leading-none">Amit Patel</div>
                                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">SDE Intern @ TechCorp</div>
                                        </div>
                                    </div>

                                    {/* // ... (Inside the component) */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl border bg-muted/10 space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">Topics Mastered</p>
                                            <p className="text-2xl font-black tracking-tighter text-[#FB923C]">{solvedProblems}/{totalProblems}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl border bg-muted/10 space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase">Mock Interviews</p>
                                            <p className="text-2xl font-black tracking-tighter text-[#FB923C]">05</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase">
                                            <span>Engineering Blueprint</span>
                                            <span className="text-[#FB923C]">{progress}% Complete</span>
                                        </div>
                                        <Progress value={progress} className="h-2 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] italic">
                                YOUR <span className="text-[#FB923C]">WORK</span> <br />
                                IS YOUR BADGE.
                            </h2>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                                We've replaced useless certificates with a living, breathing **Proof of Work Registry**. Every problem solved is logged on your public profile.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1.5 w-4 h-4 rounded-full bg-[#FB923C] flex-shrink-0" />
                                    <p className="font-bold">Public URL to showcase growth to recruiters.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1.5 w-4 h-4 rounded-full bg-[#FB923C] flex-shrink-0" />
                                    <p className="font-bold">Skill-based badges that carry actual weight.</p>
                                </div>
                            </div>
                            <Button size="lg" className="h-16 px-10 rounded-full text-xl font-black uppercase tracking-tight shadow-2xl shadow-[#FB923C]/20 bg-[#FB923C] text-white hover:bg-[#FB923C]/90">
                                Create Your Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sustainable Revenue Model - Mentor Office Hours */}
            <section id="mentor" className="py-24 bg-[#FB923C]/5 relative overflow-hidden">
                <div className="absolute -left-20 top-0 w-80 h-80 bg-[#FB923C]/10 blur-[120px] rounded-full" />
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <Badge variant="outline" className="py-1 px-4 rounded-full border-[#FB923C]/20 text-[#FB923C] font-black uppercase tracking-widest bg-white/50">
                            Sustainable Support
                        </Badge>
                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none italic">
                            OPTIONAL MENTORSHIP <br />
                            FOR <span className="text-[#FB923C]">EXTREME GROWTH</span>.
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            Everything is 100% free. We sustain the platform through optional, high-value human interactions.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white border border-[#FB923C]/20 shadow-xl shadow-[#FB923C]/5 space-y-2">
                                <MessageSquare className="h-6 w-6 text-[#FB923C]" />
                                <h4 className="font-black uppercase tracking-tight">Office Hours</h4>
                                <p className="text-xs text-muted-foreground">Book 1-on-1 time for debug help.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white border border-[#FB923C]/20 shadow-xl shadow-[#FB923C]/5 space-y-2">
                                <Users className="h-6 w-6 text-[#FB923C]" />
                                <h4 className="font-black uppercase tracking-tight">Mock Interviews</h4>
                                <p className="text-xs text-muted-foreground">Get grilled by top engineers.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-[40px] border-8 border-[#FB923C]/10 bg-white p-8 shadow-2xl relative">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-6 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#FB923C]/20 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-[#FB923C]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">1:1 Mentorship</p>
                                            <p className="text-[10px] text-muted-foreground">Expert guidance from Top Engineers</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-[#FB923C]">₹399/hr</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                            <img src="/assets/mentors/image.png" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">Vikram Singh</p>
                                            <p className="text-[10px] text-muted-foreground">Senior Staff @ Google</p>
                                        </div>
                                    </div>
                                    <Link href="https://www.linkedin.com/in/avesh-pathak/" target="_blank" className="p-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5]">
                                        <Linkedin className="h-3 w-3 fill-current" />
                                    </Link>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-dashed hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                            <img src="/assets/mentors/image2.png" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">Sarah Chen</p>
                                            <p className="text-[10px] text-muted-foreground">Manager @ Netflix</p>
                                        </div>
                                    </div>
                                    <Link href="https://www.linkedin.com/in/avesh-pathak/" target="_blank" className="p-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5]">
                                        <Linkedin className="h-3 w-3 fill-current" />
                                    </Link>
                                </div>
                                <Link href="/dashboard/mentorship" className="block">
                                    <Button className="w-full h-14 rounded-2xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-white font-black uppercase tracking-tight shadow-xl shadow-[#FB923C]/20">
                                        Find Your Mentor
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-32 bg-[#FB923C] relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 text-center space-y-10 relative">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
                        READY TO BUILD <br />YOUR BLUEPRINT?
                    </h2>
                    <div className="flex justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-white text-[#FB923C] hover:bg-white/90 h-20 px-16 rounded-full text-2xl font-black uppercase tracking-tight shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                                Launch Hub Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="py-12 border-t">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#FB923C] flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-black tracking-tighter uppercase text-sm">Babua LMS</span>
                    </div>
                    <div className="flex gap-8 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                        Built for the Babua Mindset
                    </div>
                    <p className="text-xs font-medium text-muted-foreground opacity-60">© 2024 DSA Roadmap Tracker. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
