"use client"

import React, { useState } from "react"
import { Mentor, TimeSlot } from "@/lib/types/mentor"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
    Clock,
    CheckCircle2,
    ChevronRight,
    ArrowRight,
    Search,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface BookingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mentors: Mentor[]
    mode: "flash" | "full" // flash = 15m (₹149), full = 1h (₹499)
}

export function MentorshipBookingDialog({ open, onOpenChange, mentors, mode }: BookingDialogProps) {
    const [step, setStep] = useState(1) // 1: Pick Mentor, 2: Pick Date/Time, 3: Confirm
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
    const [searchTerm, setSearchTerm] = useState("")

    const filteredMentors = mentors.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const handleNext = () => {
        if (step === 1 && selectedMentor) setStep(2)
        if (step === 2 && selectedSlot) setStep(3)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleBook = () => {
        toast.success("Session Booked!", {
            description: `You have a ${mode === "flash" ? "15-minute Flash Consult" : "1-hour session"} with ${selectedMentor?.name} on ${selectedDate && format(selectedDate, "PPP")}.`,
        })
        onOpenChange(false)
        setStep(1)
        setSelectedMentor(null)
        setSelectedSlot(null)
    }

    const price = mode === "flash" ? 149 : 499
    const duration = mode === "flash" ? "15m" : "1h"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-background border-border rounded-[32px] overflow-hidden p-0 gap-0">
                <div className="flex h-[600px]">
                    {/* Left Panel: Steps & Info */}
                    <div className="w-1/3 bg-muted/30 border-r p-6 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#FB923C] italic">Step 0{step}</h3>
                                <p className="text-xl font-black uppercase italic tracking-tighter leading-none">
                                    {step === 1 ? "Select Expert" : step === 2 ? "Pick a Slot" : "Confirm Space"}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((s) => (
                                    <div key={s} className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all",
                                            step >= s ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/20 text-muted-foreground/40"
                                        )}>
                                            {step > s ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest italic",
                                            step >= s ? "text-foreground" : "text-muted-foreground/40"
                                        )}>
                                            {s === 1 ? "Expert" : s === 2 ? "Scheduling" : "Checkout"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Service</span>
                                <span className="text-[10px] font-black uppercase text-primary italic text-right">{mode === "flash" ? "Flash Consult" : "Mission Control"}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Duration</span>
                                <span className="text-[10px] font-black uppercase text-foreground italic text-right">{duration}</span>
                            </div>
                            <Separator className="my-2 opacity-50" />
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Total</span>
                                <span className="text-lg font-black italic text-primary">₹{price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Interactive content */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-40" />
                                        <input
                                            placeholder="Search by expertise..."
                                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-muted/50 border-none text-xs font-medium focus:ring-1 ring-primary/20 transition-all outline-none"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        {filteredMentors.map(m => (
                                            <button
                                                key={m.id}
                                                onClick={() => setSelectedMentor(m)}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                                                    selectedMentor?.id === m.id
                                                        ? "border-primary bg-primary/5 shadow-sm"
                                                        : "border-border/50 hover:border-border hover:bg-muted/30"
                                                )}
                                            >
                                                <img src={m.image} alt={m.name} className="h-10 w-10 rounded-lg object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-black uppercase italic tracking-tight truncate">{m.name}</h4>
                                                    <p className="text-[9px] text-muted-foreground font-medium truncate">{m.title} @ {m.company}</p>
                                                </div>
                                                {selectedMentor?.id === m.id && <Zap className="h-3.5 w-3.5 text-primary fill-current" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 2 && selectedMentor && (
                                <div className="space-y-6">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-2xl border bg-card shadow-sm"
                                        disabled={(date: Date) => date < new Date() || date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                                    />

                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Available Slots ({format(selectedDate || new Date(), "MMM d")})</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedMentor.availability
                                                .filter(s => s.day === (selectedDate ? format(selectedDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")))
                                                .map(slot => (
                                                    <button
                                                        key={slot.id}
                                                        disabled={slot.isBooked}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={cn(
                                                            "p-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all",
                                                            selectedSlot?.id === slot.id
                                                                ? "bg-primary border-primary text-primary-foreground shadow-md"
                                                                : slot.isBooked
                                                                    ? "opacity-30 cursor-not-allowed border-dashed"
                                                                    : "bg-muted/50 border-border hover:border-primary/50"
                                                        )}
                                                    >
                                                        {slot.startTime}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && selectedMentor && selectedSlot && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in-95 duration-300">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group">
                                        <Zap className="h-10 w-10 fill-current animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter italic">Ready to Sync?</h4>
                                        <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 text-left space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><Clock className="h-4 w-4 text-primary" /></div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]/60 leading-none italic">Temporal Node</p>
                                                    <p className="text-xs font-bold">{format(selectedDate!, "PPPP")}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center"><ArrowRight className="h-4 w-4 text-primary" /></div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]/60 leading-none italic">Timing</p>
                                                    <p className="text-xs font-bold">{selectedSlot.startTime} (IST)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-medium text-muted-foreground max-w-[240px]">
                                        Secure payment channel active. Click below to finalize transmission.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t bg-muted/20 flex gap-3">
                            {step > 1 && (
                                <Button variant="outline" className="flex-1 h-12 rounded-xl border-2 font-black uppercase italic tracking-wider text-xs" onClick={handleBack}>
                                    Abort
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button
                                    className="flex-[2] h-12 rounded-xl bg-primary text-white font-black uppercase italic tracking-wider text-xs group transition-all active:scale-95"
                                    disabled={step === 1 ? !selectedMentor : !selectedSlot}
                                    onClick={handleNext}
                                >
                                    Proceed <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            ) : (
                                <Button
                                    className="flex-1 h-14 rounded-xl bg-primary text-white font-black uppercase italic tracking-widest text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all"
                                    onClick={handleBook}
                                >
                                    Confirm & Pay ₹{price}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("h-px w-full bg-border", className)} {...props} />
}
