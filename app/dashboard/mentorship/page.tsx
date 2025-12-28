"use client"

import React, { useState } from "react"
import { MOCK_MENTORS } from "@/lib/data/mentors"
import { MentorCard } from "@/components/mentor-card"
import { Search, Filter, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function MentorshipPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredMentors = MOCK_MENTORS.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FB923C]/10 border border-[#FB923C]/20 w-fit">
                        <Sparkles className="h-3.5 w-3.5 text-[#FB923C]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]">Babua Premier Support</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
                        Mastery Requires <br /> <span className="text-[#FB923C]">Mentorship.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        Book optional 1-on-1 sessions with top engineers.
                        <br className="hidden md:block" />
                        Your fees directly support the platform to keep core learning free.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by company, skill, or name..."
                            className="pl-10 h-12 rounded-2xl bg-card border-border/50 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-[#FB923C]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 w-12 rounded-2xl shrink-0 p-0">
                        <Filter className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                ))}
            </div>

            {filteredMentors.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-[40px] border border-dashed">
                    <p className="text-muted-foreground font-medium">No mentors found matching "{searchTerm}"</p>
                    <Button
                        variant="link"
                        onClick={() => setSearchTerm("")}
                        className="text-[#FB923C]"
                    >
                        Clear filters
                    </Button>
                </div>
            )}
        </div>
    )
}
