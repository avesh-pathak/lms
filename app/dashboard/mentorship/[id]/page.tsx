"use client"

import React, { useState, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MOCK_MENTORS } from "@/lib/data/mentors"
import { BookingCalendar } from "@/components/booking-calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ArrowRight, CheckCircle2, ChevronLeft, Star, Clock, Zap } from "lucide-react"
import { saveSessionData, getSessionData } from "@/lib/local-storage"
import { cn } from "@/lib/utils"

export default function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const mentor = MOCK_MENTORS.find(m => m.id === id)

    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [step, setStep] = useState<"calendar" | "checkout" | "success">("calendar")
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderId] = useState(() => `BABUA-${Math.floor(Math.random() * 90000) + 10000}`)

    if (!mentor) return notFound()

    const handleSlotSelect = (date: Date, time: string) => {
        setSelectedDate(date)
        setSelectedTime(time)
    }

    const handleConfirm = async () => {
        setIsProcessing(true)
        // Simulated latency for professional feel
        await new Promise(resolve => setTimeout(resolve, 1200))

        const newSession = {
            id: crypto.randomUUID(),
            mentorId: mentor.id,
            mentorName: mentor.name,
            mentorImage: mentor.image,
            mentorTitle: mentor.title,
            mentorCompany: mentor.company,
            date: selectedDate.toISOString(),
            time: selectedTime!,
            status: "upcoming" as const,
            meetingLink: "https://meet.google.com/babua-mentorship-link"
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
            {/* LEFT PROFILE SIDEBAR */}
            <div className="w-full lg:w-[400px] border-r bg-muted/5 p-8 lg:p-10 space-y-10 lg:sticky top-0 h-fit lg:h-screen overflow-y-auto scrollbar-hide">
                <Link href="/dashboard/mentorship">
                    <Button variant="ghost" className="group -ml-4 px-4 text-muted-foreground hover:text-foreground mb-4">
                        <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Mentors
                    </Button>
                </Link>

                <div className="space-y-6">
                    <div className="relative inline-block">
                        <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-32 h-32 rounded-[40px] object-cover border-4 border-background shadow-2xl"
                        />
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-background shadow-lg">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{mentor.name}</h1>
                        <p className="text-sm font-bold text-muted-foreground uppercase opacity-80 tracking-tight">{mentor.title} @ <span className="text-primary italic">{mentor.company}</span></p>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-black text-yellow-600">{mentor.rating}</span>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                            {mentor.sessionsCompleted} Sessions
                        </div>
                    </div>
                </div>

                <div className="space-y-8 pt-6 border-t border-border/50">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Bio</h3>
                        <p className="text-sm font-medium leading-relaxed italic opacity-70">"{mentor.bio}"</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map(skill => (
                                <Badge key={skill} variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest italic">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* BABUA GUARANTEE */}
                    <div className="p-6 rounded-[32px] bg-emerald-500/[0.03] border-2 border-emerald-500/10 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="h-20 w-20 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 relative z-10">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">Babua Guarantee</span>
                        </div>
                        <p className="text-[11px] text-emerald-900/60 dark:text-emerald-100/60 font-medium leading-relaxed italic relative z-10">
                            If the session doesn't yield measurable throughput, we will issue a <span className="text-emerald-600 dark:text-emerald-400 font-black tracking-widest">100% REFUND</span> instantly.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT BOOKING FLOW */}
            <div className="flex-1 flex flex-col bg-background/50 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 relative z-10">
                    <div className="w-full max-w-2xl">
                        {step === "calendar" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                                <div className="space-y-1 text-center">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Schedule Synchronization</h2>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-70">Select a temporal node for execution</p>
                                </div>

                                <div className="p-6 rounded-[32px] bg-card border-2 border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                                    <BookingCalendar
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        onSelectSlot={handleSlotSelect}
                                        availability={mentor.availability}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-[32px] bg-primary/[0.02] border-2 border-dashed border-primary/20">
                                    <div className="space-y-0.5">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground italic opacity-70">Required Credit</div>
                                        <div className="text-2xl font-black italic tracking-tighter text-primary">₹{mentor.hourlyRate}</div>
                                    </div>
                                    <Button
                                        disabled={!selectedTime}
                                        onClick={() => setStep("checkout")}
                                        className="h-12 px-8 rounded-xl font-black italic uppercase tracking-[0.15em] bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 disabled:grayscale text-xs"
                                    >
                                        Proceed <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === "checkout" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
                                <div className="space-y-2 text-center">
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Checkout Confirmation</h2>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] opacity-40">Initialize technical linkage protocols</p>
                                </div>

                                <div className="p-10 rounded-[48px] bg-card border-2 border-border/50 shadow-2xl space-y-10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8" />

                                    <div className="flex items-center gap-6">
                                        <img src={mentor.image} alt={mentor.name} className="h-20 w-20 rounded-[28px] object-cover border shadow-xl" />
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black uppercase italic tracking-tighter italic">{mentor.name}</h3>
                                            <p className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{mentor.title} @ {mentor.company}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-dashed border-border/50">
                                        <div className="space-y-2 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 text-primary italic">Temporal Node</span>
                                            <div className="text-xl font-black italic tracking-tighter flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-primary" /> {selectedDate.toDateString()}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-left">
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80 text-primary italic">Synchronization</span>
                                            <div className="text-xl font-black italic tracking-tighter flex items-center gap-3">
                                                <Zap className="w-5 h-5 text-primary" /> {selectedTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center md:items-center text-center md:text-left">
                                        <div className="space-y-1">
                                            <span className="text-xs font-black uppercase italic tracking-[0.3em] opacity-30">Total Value</span>
                                            <div className="text-4xl font-black italic tracking-tighter text-primary leading-none">₹{mentor.hourlyRate}</div>
                                        </div>
                                        <Button
                                            onClick={handleConfirm}
                                            disabled={isProcessing}
                                            className="w-full md:w-auto h-16 px-12 rounded-2xl font-black italic uppercase tracking-[0.3em] bg-foreground text-background hover:bg-foreground/90 shadow-2xl transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isProcessing ? "INITIALIZING..." : "Pay & Confirm"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button variant="outline" onClick={() => setStep("calendar")} className="flex-1 h-14 rounded-2xl font-black italic uppercase tracking-widest text-[10px] border-2">
                                        Modify Schedule
                                    </Button>
                                    <div className="flex-[1.5] flex items-center justify-center p-4 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                        <span className="text-[9px] font-black uppercase tracking-widest italic leading-tight">Secured via Babua Protocol</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === "success" && (
                            <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700">
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 rounded-[48px] bg-emerald-500/20 text-emerald-600 flex items-center justify-center border-2 border-emerald-500/30 shadow-2xl">
                                        <CheckCircle2 className="w-16 h-16" />
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 h-12 w-12 bg-white rounded-2xl border-2 flex items-center justify-center shadow-lg">
                                        <Zap className="h-6 w-6 text-primary fill-current" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Node Established.</h2>
                                    <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.4em] opacity-80">Order ID: {orderId}</p>
                                </div>

                                <div className="p-10 rounded-[64px] bg-card border-2 border-emerald-500/10 shadow-2xl space-y-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none" />
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-600">Protocol Synchronized</h3>
                                        <p className="text-sm font-medium italic opacity-60">You are now scheduled for a high-bandwidth session with <span className="text-foreground font-black">{mentor.name}</span>.</p>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-dashed border-border/50">
                                        <Link href="/dashboard">
                                            <Button className="w-full h-16 rounded-2xl font-black italic uppercase tracking-[0.2em] bg-primary text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                                Return
                                            </Button>
                                        </Link>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-80 italic px-8">
                                            A secure meeting link and calendar node has been transmitted to your primary terminal email.
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
