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
    Satellite,
    Plus,
    X,
    Loader2,
    Clock,
    ChevronUp,
    ChevronDown,
    CalendarCheck2
} from "lucide-react"
import { MentorshipBookingDialog } from "@/components/mentorship-booking-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { toast } from "sonner"

type Signal = {
    title: string
    description: string
    techStack: string[]
    milestones: { title: string; completed: boolean }[]
}

export default function MentorshipPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [isSOSDialogOpen, setIsSOSDialogOpen] = useState(false)
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [bookingMode, setBookingMode] = useState<"flash" | "full">("flash")
    const [isSaving, setIsSaving] = useState(false)
    const [isMissionControlOpen, setIsMissionControlOpen] = useState(true)

    // New SOS Form State
    const [newSignal, setNewSignal] = useState<Partial<Signal>>({
        title: "",
        description: "",
        techStack: [],
        milestones: []
    })
    const [techInput, setTechInput] = useState("")
    const [blockerInput, setBlockerInput] = useState("")

    const filteredMentors = MOCK_MENTORS.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleBroadcast = async () => {
        if (!newSignal.title) return toast.error("Signal title required")
        setIsSaving(true)
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newSignal,
                    status: "Transmitting",
                    lastActivity: "Just now",
                    progress: 0
                })
            })
            if (res.ok) {
                toast.success("SOS Signal Transmitted!", {
                    description: "Elite mentors have been notified to standby.",
                })
                setIsSOSDialogOpen(false)
                setNewSignal({ title: "", description: "", techStack: [], milestones: [] })
            }
        } catch (err) {
            toast.error("Transmission failed")
        } finally {
            setIsSaving(false)
        }
    }

    const addTech = () => {
        if (techInput && !newSignal.techStack?.includes(techInput)) {
            setNewSignal(prev => ({ ...prev, techStack: [...(prev.techStack || []), techInput] }))
            setTechInput("")
        }
    }

    const addBlocker = () => {
        if (blockerInput) {
            setNewSignal(prev => ({
                ...prev,
                milestones: [...(prev.milestones || []), { title: blockerInput, completed: false }]
            }))
            setBlockerInput("")
        }
    }

    return (
        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
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

            {/* 4 Support Module Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* TRANSMITTER SOS */}
                <Card className="p-4 rounded-[20px] bg-white border border-red-100 hover:border-red-200 hover:shadow-md transition-all group relative overflow-hidden flex flex-col items-center text-center">
                    <div className="h-9 w-9 rounded-lg bg-red-500 text-white flex items-center justify-center mb-3 shadow-md shadow-red-500/20 relative z-10 transition-transform group-hover:scale-110">
                        <Radio className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 relative z-10 flex-1">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter">Transmitter SOS</h3>
                        <p className="text-[9px] font-medium text-muted-foreground leading-tight">
                            Specific code blocker help in &lt; 24h.
                        </p>
                    </div>
                    <div className="mt-3 w-full relative z-10">
                        <Dialog open={isSOSDialogOpen} onOpenChange={setIsSOSDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full h-9 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-black italic uppercase tracking-widest text-[8px] transition-all">
                                    Broadcast (₹299)
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl bg-[#0a0a0a] border-white/10 rounded-[32px] overflow-hidden text-white backdrop-blur-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-primary flex items-center gap-3">
                                        <Satellite className="h-7 w-7 text-primary" /> Transmission
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto px-1 scrollbar-hide">
                                    <div className="grid gap-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#FB923C]/50">Signal Title</label>
                                        <Input
                                            placeholder="e.g. Memory Leak"
                                            className="bg-white/5 border-white/10 h-12 rounded-xl text-base font-black placeholder:opacity-20 text-white"
                                            value={newSignal.title}
                                            onChange={e => setNewSignal(prev => ({ ...prev, title: e.target.value }))}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-[#FB923C]/50">Description</label>
                                        <Textarea
                                            placeholder="Current status..."
                                            className="bg-white/5 border-white/10 min-h-[100px] rounded-xl p-3 text-sm font-medium placeholder:opacity-20 text-white"
                                            value={newSignal.description}
                                            onChange={e => setNewSignal(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#FB923C]/50">Tech</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Go, C++"
                                                    className="bg-white/5 border-white/10 h-10 rounded-lg text-xs"
                                                    value={techInput}
                                                    onChange={e => setTechInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addTech()}
                                                />
                                                <Button onClick={addTech} size="icon" variant="outline" className="rounded-lg h-10 w-10 border-white/10 bg-transparent hover:bg-white/10"><Plus className="h-4 w-4" /></Button>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {newSignal.techStack?.map(t => (
                                                    <Badge key={t} className="bg-white/10 text-white font-black uppercase tracking-widest italic py-0.5 px-2 text-[8px]">
                                                        {t}
                                                        <X className="ml-1.5 h-2.5 w-2.5 cursor-pointer opacity-50 hover:opacity-100" onClick={() => setNewSignal(prev => ({ ...prev, techStack: prev.techStack?.filter(x => x !== t) }))} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#FB923C]/50">Blockers</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add blocker..."
                                                    className="bg-white/5 border-white/10 h-10 rounded-lg text-xs"
                                                    value={blockerInput}
                                                    onChange={e => setBlockerInput(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && addBlocker()}
                                                />
                                                <Button onClick={addBlocker} size="icon" variant="outline" className="rounded-lg h-10 w-10 border-white/10 bg-transparent hover:bg-white/10"><Plus className="h-4 w-4" /></Button>
                                            </div>
                                            <div className="space-y-1 mt-1">
                                                {newSignal.milestones?.map((m, i) => (
                                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase italic">
                                                        <span className="opacity-70 text-white">{m.title}</span>
                                                        <X className="h-3 w-3 cursor-pointer opacity-40 hover:opacity-100" onClick={() => setNewSignal(prev => ({ ...prev, milestones: prev.milestones?.filter((_, idx) => idx !== i) }))} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="pt-6 pb-2">
                                    <Button
                                        onClick={handleBroadcast}
                                        disabled={isSaving}
                                        className="w-full h-14 bg-primary text-white font-black italic uppercase tracking-widest text-lg rounded-xl shadow-xl shadow-primary/20"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin h-5 w-5" /> : "Broadcast"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </Card>

                {/* CLINICAL ROAST */}
                <Card className="p-4 rounded-[20px] bg-white border border-orange-100 hover:border-orange-200 hover:shadow-md transition-all group relative overflow-hidden flex flex-col items-center text-center">
                    <div className="h-9 w-9 rounded-lg bg-orange-500 text-white flex items-center justify-center mb-3 shadow-md shadow-orange-500/20 relative z-10 transition-transform group-hover:scale-110">
                        <Flame className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 relative z-10 flex-1">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter">Clinical Roast</h3>
                        <p className="text-[9px] font-medium text-muted-foreground leading-tight">
                            Resume/code audit by experts.
                        </p>
                    </div>
                    <div className="mt-3 w-full relative z-10">
                        <Link href="/dashboard/roast">
                            <Button variant="outline" className="w-full h-9 rounded-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-black italic uppercase tracking-widest text-[8px] transition-all">
                                Roast (₹199)
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* FLASH CONSULT */}
                <Card className="p-4 rounded-[20px] bg-white border border-indigo-100 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden flex flex-col items-center text-center">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20 relative z-10 transition-transform group-hover:scale-110">
                        <Zap className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 relative z-10 flex-1">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter">Flash Consult</h3>
                        <p className="text-[9px] font-medium text-muted-foreground leading-tight">
                            15m tech/career guidance.
                        </p>
                    </div>
                    <div className="mt-3 w-full relative z-10">
                        <Button
                            variant="outline"
                            className="w-full h-9 rounded-lg border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white font-black italic uppercase tracking-widest text-[8px] transition-all"
                            onClick={() => {
                                setBookingMode("flash")
                                setIsBookingOpen(true)
                            }}
                        >
                            Consult (₹149)
                        </Button>
                    </div>
                </Card>

                {/* 1-HOUR MISSION CONTROL (TOGGLE CARD) */}
                <Card
                    className={`p-4 rounded-[20px] bg-white border-2 transition-all group relative overflow-hidden flex flex-col items-center text-center cursor-pointer ${isMissionControlOpen ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-emerald-100 hover:border-emerald-200'}`}
                    onClick={() => setIsMissionControlOpen(!isMissionControlOpen)}
                >
                    <div className="h-9 w-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-500/20 relative z-10 transition-transform group-hover:scale-110">
                        <Clock className="h-4 w-4" />
                    </div>
                    <div className="space-y-0.5 relative z-10 flex-1">
                        <h3 className="text-sm font-black italic uppercase tracking-tighter">Mission Control</h3>
                        <p className="text-[9px] font-medium text-muted-foreground leading-tight">
                            1h deep roadmap/arch planning.
                        </p>
                    </div>
                    <div className="mt-3 w-full relative z-10">
                        <Button variant={isMissionControlOpen ? "default" : "outline"} className={`w-full h-9 rounded-lg font-black italic uppercase tracking-widest text-[8px] transition-all ${isMissionControlOpen ? 'bg-emerald-500 text-white border-0' : 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                            {isMissionControlOpen ? "Active Session" : "1-Hour (₹499)"}
                            {isMissionControlOpen ? <ChevronUp className="ml-1.5 h-2.5 w-2.5" /> : <ChevronDown className="ml-1.5 h-2.5 w-2.5" />}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* MISSION CONTROL CENTER (Experts list) - RENDERED CONDITIONALLY */}
            {isMissionControlOpen && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3 border-t border-emerald-500/10 pt-6">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-orange-500/5 border border-orange-500/10">
                                <span className="text-[7px] font-black uppercase tracking-widest text-orange-500 italic">Phase 01: Mentorship Data</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Mission Control Center</h2>
                            <p className="text-muted-foreground font-medium text-xs leading-relaxed opacity-60">
                                Elite mentors currently on standby for technical execution.
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

                    {/* Mentors Grid Inside Mission Control */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-20">
                        {filteredMentors.map(mentor => (
                            <MentorCard
                                key={mentor.id}
                                mentor={mentor}
                                onBook={() => {
                                    setBookingMode("full")
                                    setIsBookingOpen(true)
                                }}
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

            <MentorshipBookingDialog
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                mentors={MOCK_MENTORS}
                mode={bookingMode}
            />
        </div>
    )
}
