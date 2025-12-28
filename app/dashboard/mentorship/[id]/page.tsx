
"use client"

import React, { useState, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MOCK_MENTORS } from "@/lib/data/mentors"
import { BookingCalendar } from "@/components/booking-calendar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, Clock, Video, ShieldCheck, ArrowRight, CheckCircle2, Linkedin } from "lucide-react"
import { saveSessionData, getSessionData } from "@/lib/local-storage"

export default function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const mentor = MOCK_MENTORS.find(m => m.id === id)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [step, setStep] = useState<"calendar" | "confirm">("calendar")
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    if (!mentor) return notFound()

    const handleSlotSelect = (date: Date, time: string) => {
        setSelectedDate(date)
        setSelectedTime(time)
    }


    const handlePayment = async () => {
        setIsProcessing(true)
        // Simulate API call / Payment Gateway
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Save session to local storage
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
            meetingLink: "https://meet.google.com/abc-defg-hij" // Mock link
        }

        const currentData = getSessionData()
        saveSessionData({
            bookedSessions: [...(currentData.bookedSessions || []), newSession]
        })

        setIsProcessing(false)
        setIsSuccess(true)
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Split Layout */}
            <div className="flex flex-col lg:flex-row h-full">

                {/* Left: Mentor Profile */}
                <div className="w-full lg:w-[40%] p-6 lg:p-10 border-r bg-muted/10 space-y-8 lg:sticky top-0 h-fit lg:h-screen overflow-y-auto">
                    <div>
                        <Button variant="link" className="px-0 text-muted-foreground hover:text-foreground mb-4" onClick={() => window.history.back()}>
                            ← Back to mentors
                        </Button>
                        <div className="flex items-start gap-5">
                            <img
                                src={mentor.image}
                                alt={mentor.name}
                                className="w-24 h-24 rounded-[32px] object-cover border-4 border-background shadow-lg"
                            />
                            <div className="space-y-1 pt-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-black tracking-tight">{mentor.name}</h1>
                                    <Link href="https://www.linkedin.com/in/avesh-pathak/" target="_blank" className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                        <Linkedin className="w-4 h-4 fill-current" />
                                    </Link>
                                </div>
                                <p className="text-muted-foreground font-medium">{mentor.title} at {mentor.company}</p>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    <span className="font-bold">{mentor.rating}</span>
                                    <span className="text-muted-foreground text-sm">({mentor.sessionsCompleted} sessions)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">About</h3>
                        <p className="text-base leading-relaxed text-foreground/90 font-medium">{mentor.bio}</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Qualification</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="text-xs font-bold uppercase text-muted-foreground/70">Education</div>
                                <div className="font-medium">{mentor.education}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-xs font-bold uppercase text-muted-foreground/70">Experience</div>
                                <ul className="space-y-1">
                                    {mentor.experience?.map((exp, i) => (
                                        <li key={i} className="text-sm font-medium border-l-2 border-muted pl-3">{exp}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {mentor.expertise.map(skill => (
                                <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                        <div className="flex items-center gap-2 text-blue-600">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="font-black text-sm uppercase tracking-wide">Babua Guarantee</span>
                        </div>
                        <p className="text-sm text-blue-900/70 font-medium">
                            If you're not satisfied with the session, we'll refund 100% of your money. No questions asked.
                        </p>
                    </div>
                </div>

                {/* Right: Booking Flow */}
                <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center min-h-[600px]">
                    <div className="w-full max-w-xl space-y-8">

                        {isSuccess ? (
                            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-4xl font-black tracking-tighter">Booking Confirmed!</h2>
                                <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                                    You're scheduled with <span className="text-foreground font-bold">{mentor.name}</span> for <span className="text-foreground font-bold">{selectedDate.toDateString()}</span> at <span className="text-foreground font-bold">{selectedTime}</span>.
                                </p>
                                <div className="pt-8">
                                    <Button onClick={() => window.location.href = "/dashboard"} className="h-14 px-8 rounded-2xl font-bold text-lg bg-[#FB923C] hover:bg-[#FB923C]/90 text-white shadow-xl shadow-[#FB923C]/20">
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </div>
                        ) : step === "calendar" ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2 text-center lg:text-left">
                                    <h2 className="text-3xl font-black tracking-tight">Book a Session</h2>
                                    <p className="text-muted-foreground">Select a time that works for you. All times are 1 hour.</p>
                                </div>

                                <div className="p-6 rounded-[32px] border bg-card shadow-sm">
                                    <BookingCalendar
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        onSelectSlot={handleSlotSelect}
                                        availability={mentor.availability}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-[32px] bg-muted/30 border border-dashed">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Total Amount</div>
                                        <div className="text-2xl font-black">₹{mentor.hourlyRate}</div>
                                    </div>
                                    <Button
                                        disabled={!selectedTime}
                                        onClick={() => setStep("confirm")}
                                        className="h-12 px-8 rounded-xl font-bold uppercase tracking-wide bg-[#FB923C] hover:bg-[#FB923C]/90 text-white shadow-lg shadow-[#FB923C]/20"
                                    >
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight">Confirm Booking</h2>
                                    <p className="text-muted-foreground">You're almost there! Review the details below.</p>
                                </div>

                                <div className="p-8 rounded-[32px] border bg-card shadow-sm space-y-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FB923C]/10 to-transparent rounded-bl-[100px] -mr-8 -mt-8" />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between pb-4 border-b border-dashed">
                                            <span className="text-muted-foreground font-medium">Mentor</span>
                                            <span className="font-bold">{mentor.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between pb-4 border-b border-dashed">
                                            <span className="text-muted-foreground font-medium">Date</span>
                                            <span className="font-bold">{selectedDate.toDateString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between pb-4 border-b border-dashed">
                                            <span className="text-muted-foreground font-medium">Time</span>
                                            <span className="font-bold">{selectedTime}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="font-black text-lg">Total</span>
                                            <span className="font-black text-2xl text-[#FB923C]">₹{mentor.hourlyRate}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={() => setStep("calendar")} className="h-12 rounded-xl font-bold">
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="h-12 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
                                    >
                                        {isProcessing ? "Processing..." : "Pay & Confirm"}
                                    </Button>
                                </div>

                                <p className="text-xs text-center text-muted-foreground">
                                    By confirming, you agree to Babua's terms of service.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    )
}
