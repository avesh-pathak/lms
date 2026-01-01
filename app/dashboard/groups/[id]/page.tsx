"use client"

import React, { useState, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MOCK_SQUADS } from "@/lib/data/groups"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Zap,
    ArrowRight,
    ShieldCheck,
    CheckCircle2,
    ChevronLeft,
    Clock,
    Calendar,
    Target,
    Terminal,
    Flame
} from "lucide-react"
import { saveSessionData, getSessionData } from "@/lib/local-storage"

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const squad = MOCK_SQUADS.find(s => s.id === id)

    const [step, setStep] = useState<"overview" | "checkout" | "success">("overview")
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderId] = useState(() => `SQUAD-${Math.floor(Math.random() * 90000) + 10000}`)

    if (!squad) return notFound()

    const handleSubscription = async () => {
        setIsProcessing(true)
        // Simulated latency for subscription enrollment
        await new Promise(resolve => setTimeout(resolve, 1500))

        const newSession = {
            id: crypto.randomUUID(),
            mentorId: squad.mentorId,
            mentorName: squad.mentorName,
            mentorImage: squad.mentorImage,
            mentorTitle: squad.mentorTitle,
            mentorCompany: squad.mentorCompany,
            date: new Date().toISOString(), // Subscription start
            time: "RECURRING",
            status: "upcoming" as const,
            meetingLink: "https://discord.gg/babua-squad-room"
        }

        const currentData = getSessionData()
        saveSessionData({
            bookedSessions: [...(currentData.bookedSessions || []), newSession]
        })

        setIsProcessing(false)
        setStep("success")
    }

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row animate-in fade-in duration-700">
            {/* LEFT: SQUAD MANIFESTO */}
            <div className="w-full lg:w-[450px] border-r bg-muted/5 p-8 lg:p-12 space-y-10 lg:sticky top-0 h-fit lg:h-screen overflow-y-auto scrollbar-hide">
                <Link href="/dashboard/groups">
                    <Button variant="ghost" className="group -ml-4 px-4 text-muted-foreground hover:text-foreground mb-4">
                        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> All Squads
                    </Button>
                </Link>

                <div className="space-y-6">
                    <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/10 font-black text-[10px] uppercase tracking-widest italic">
                        {squad.category} Coalition
                    </Badge>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{squad.name}</h1>
                    <p className="text-sm font-bold text-muted-foreground italic leading-relaxed opacity-80">
                        {squad.description}
                    </p>
                </div>

                <div className="space-y-8 pt-6 border-t border-border/50">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">The Manifesto</h3>
                        <div className="space-y-4">
                            {squad.manifesto.map((item, i) => (
                                <div key={i} className="flex gap-3 group">
                                    <div className="mt-1 h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                                        <Target className="w-3 h-3 text-primary group-hover:text-white" />
                                    </div>
                                    <p className="text-xs font-bold italic opacity-70 group-hover:opacity-100 transition-opacity">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Mentor Lead</h3>
                        <div className="flex items-center gap-4 p-4 rounded-[32px] bg-card border-2 border-border/50 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img src={squad.mentorImage} alt={squad.mentorName} className="w-12 h-12 rounded-2xl object-cover border-2 shadow-lg relative z-10" />
                            <div className="relative z-10 space-y-0.5">
                                <p className="text-xs font-black uppercase italic italic">{squad.mentorName}</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest leading-none">{squad.mentorTitle} @ {squad.mentorCompany}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: ACTION FLOW */}
            <div className="flex-1 flex flex-col bg-background/50 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

                <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                    <div className="w-full max-w-2xl">

                        {step === "overview" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Initialize Enrollment</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-60">Establish a persistent neural link</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 rounded-[48px] bg-card border-2 border-border/50 space-y-3 hover:border-primary/50 transition-all duration-500">
                                        <Users className="w-10 h-10 text-primary mb-2" />
                                        <h4 className="text-base font-black italic uppercase tracking-tighter">Squad Capacity</h4>
                                        <div className="text-2xl font-black italic text-primary">{squad.memberCount} / {squad.maxMembers}</div>
                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase italic">Limited throughput nodes available</p>
                                    </div>
                                    <div className="p-8 rounded-[48px] bg-card border-2 border-border/50 space-y-3 hover:border-primary/50 transition-all duration-500">
                                        <Calendar className="w-10 h-10 text-primary mb-2" />
                                        <h4 className="text-base font-black italic uppercase tracking-tighter">Weekly Frequency</h4>
                                        <div className="space-y-1">
                                            {squad.weeklySchedule.map((time, i) => (
                                                <div key={i} className="text-[10px] font-black italic uppercase text-primary/80 leading-none">{time}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 lg:p-10 rounded-[48px] bg-primary/[0.02] border-2 border-dashed border-primary/30 flex flex-wrap flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 relative overflow-hidden">
                                    <div className="space-y-1 text-center lg:text-left shrink-0">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Subscription Model</div>
                                        <div className="text-3xl lg:text-4xl font-black italic tracking-tighter text-primary flex items-baseline gap-2 justify-center lg:justify-start">
                                            ₹{squad.monthlyPrice}
                                            <span className="text-[10px] lg:text-xs text-muted-foreground/40 font-bold tracking-widest uppercase">/ month</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setStep("checkout")}
                                        className="w-full lg:w-auto h-16 px-8 lg:px-10 rounded-2xl font-black italic uppercase tracking-[0.1em] bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap"
                                    >
                                        Proceed to Checkout <ArrowRight className="ml-3 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === "checkout" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Confirm Coalition Join</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] opacity-60">Authorize recurring transmission credits</p>
                                </div>

                                <div className="p-10 rounded-[56px] bg-card border-2 border-border/50 shadow-[0_30px_70px_rgba(0,0,0,0.12)] space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-bl-[100px] -mr-12 -mt-12" />

                                    <div className="flex items-center gap-6 pb-8 border-b border-dashed border-border/50">
                                        <div className="p-1 rounded-[28px] bg-primary/10 border-2 border-primary/20">
                                            <div className="h-20 w-20 rounded-[24px] bg-primary text-white flex items-center justify-center">
                                                <Users className="h-10 w-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter italic">{squad.name}</h3>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-60">Led by {squad.mentorName}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6 py-4">
                                        <div className="flex justify-between items-center text-left group">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Billing Frequency</span>
                                                <div className="text-xl font-black italic uppercase tracking-tighter">Monthly Recursive</div>
                                            </div>
                                            <Badge variant="outline" className="text-[8px] font-black uppercase italic italic border-emerald-500/30 text-emerald-600 bg-emerald-500/5">Instant Terminate Anytime</Badge>
                                        </div>
                                        <div className="flex flex-wrap flex-col lg:flex-row justify-center lg:justify-between items-center gap-8 text-center lg:text-left">
                                            <div className="space-y-1 shrink-0">
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Total Monthly Allocation</span>
                                                <div className="text-4xl font-black italic uppercase tracking-tighter text-primary">₹{squad.monthlyPrice}</div>
                                            </div>
                                            <Button
                                                onClick={handleSubscription}
                                                disabled={isProcessing}
                                                className="w-full lg:w-auto h-16 px-10 lg:px-12 rounded-2xl font-black italic uppercase tracking-[0.1em] bg-foreground text-background hover:bg-foreground/90 shadow-2xl transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
                                            >
                                                {isProcessing ? "PROCESSING..." : "Initialize Sub"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center items-center gap-6">
                                    <Button variant="ghost" onClick={() => setStep("overview")} className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:text-foreground">
                                        Abort Request
                                    </Button>
                                    <div className="h-1 w-1 rounded-full bg-border" />
                                    <div className="flex items-center gap-2 text-emerald-600/60">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic">Babua Secure Protocol</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === "success" && (
                            <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 rounded-[56px] bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/30 shadow-2xl relative z-10">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 h-14 w-14 bg-white rounded-2xl border-2 flex items-center justify-center shadow-2xl z-20">
                                        <Zap className="h-7 w-7 text-primary fill-current" />
                                    </div>
                                    <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/5 rounded-full blur-xl animate-pulse" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.8]">Neural Coalition Joined.</h2>
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.6em] opacity-60 pt-2">ID: {orderId}</p>
                                </div>

                                <div className="p-12 rounded-[64px] bg-card border-2 border-emerald-500/20 shadow-[0_40px_80px_rgba(0,0,0,0.15)] space-y-10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/[0.01]" />
                                    <div className="space-y-3 relative z-10">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-600 italic">Transmission Established</h3>
                                        <p className="text-sm font-bold italic opacity-60 leading-relaxed max-w-[320px] mx-auto">
                                            Welcome to the <span className="text-foreground font-black">{squad.name}</span>. Your technical acceleration protocols are now active.
                                        </p>
                                    </div>

                                    <div className="pt-8 border-t border-dashed border-border/50 relative z-10 space-y-4">
                                        <Link href="/dashboard">
                                            <Button className="w-full h-16 rounded-2xl font-black italic uppercase tracking-[0.2em] bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                                Enter Mission Command
                                            </Button>
                                        </Link>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic px-12 leading-relaxed">
                                            Your primary terminal will receive Discord 'War Room' linkage and session node schedule within 10 minutes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
