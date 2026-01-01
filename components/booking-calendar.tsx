"use client"

import React, { useState } from "react"
import { addDays, format, isSameDay, startOfToday } from "date-fns"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { TimeSlot } from "@/lib/types/mentor"

interface BookingCalendarProps {
    onSelectSlot: (date: Date, time: string) => void
    selectedDate: Date
    selectedTime: string | null
    availability: TimeSlot[]
}

export function BookingCalendar({ onSelectSlot, selectedDate, selectedTime, availability }: BookingCalendarProps) {
    const today = startOfToday()
    const [currentStartDate, setCurrentStartDate] = useState(today)

    // Generate next 14 days
    const days = Array.from({ length: 5 }).map((_, i) => addDays(currentStartDate, i))

    // Filter available slots for a specific date
    const getAvailableSlots = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd")
        return availability.filter(slot => slot.day === dateStr && !slot.isBooked)
    }

    const nextDays = () => setCurrentStartDate(addDays(currentStartDate, 5))
    const prevDays = () => {
        const newDate = addDays(currentStartDate, -5)
        if (newDate >= today) setCurrentStartDate(newDate)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="space-y-0.5">
                    <h3 className="font-bold text-lg">Select a Time</h3>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {format(days[0], "MMMM yyyy")}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevDays} disabled={currentStartDate <= today} className="h-8 w-8 rounded-full">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextDays} className="h-8 w-8 rounded-full">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDate)
                    const slots = getAvailableSlots(day)

                    return (
                        <div key={day.toString()} className="space-y-3">
                            <div className={cn(
                                "text-center p-2 rounded-xl text-sm font-medium transition-colors border",
                                isSelected ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 border-transparent text-muted-foreground"
                            )}>
                                <div className="text-[10px] uppercase font-black tracking-wider text-muted-foreground/90">{format(day, "EEE")}</div>
                                <div className="font-black text-lg">{format(day, "d")}</div>
                            </div>

                            <div className="space-y-2">
                                {slots.length === 0 ? (
                                    <div className="text-[10px] text-center text-muted-foreground py-2 italic opacity-50">
                                        No slots
                                    </div>
                                ) : (
                                    slots.map(slot => (
                                        <button
                                            type="button"
                                            key={slot.id}
                                            onClick={() => onSelectSlot(day, slot.startTime)}
                                            className={cn(
                                                "w-full text-xs font-bold py-2 rounded-lg border transition-all hover:scale-105 active:scale-95 cursor-pointer",
                                                isSelected && selectedTime === slot.startTime
                                                    ? "bg-[#FB923C] text-white border-[#FB923C] shadow-md shadow-[#FB923C]/20"
                                                    : "bg-background border-border hover:border-primary/50 text-foreground"
                                            )}
                                        >
                                            {slot.startTime}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground justify-center pt-2">
                <Clock className="w-3 h-3" />
                <span>All times in your local timezone</span>
            </div>
        </div>
    )
}
