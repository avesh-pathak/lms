import React from "react"
import Link from "next/link"
import { Mentor } from "@/lib/types/mentor"
import { Star, MessageSquare, Briefcase, Globe, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function MentorCard({ mentor, onBook }: { mentor: Mentor, onBook?: (mentor: Mentor) => void }) {
    return (
        <div className="group relative flex flex-col p-6 rounded-[40px] border-2 border-border/50 bg-card/40 backdrop-blur-xl hover:border-[#FB923C]/50 hover:bg-card/60 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden hover:-translate-y-2">
            {/* Stretched Link for the whole card */}
            <Link
                href={`/dashboard/mentorship/${mentor.id}`}
                className="absolute inset-0 z-0"
                aria-label={`View ${mentor.name}'s profile`}
            />
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FB923C]/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:bg-[#FB923C]/10 transition-colors" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-tr-[100px] -ml-8 -mb-8 group-hover:bg-primary/10 transition-colors" />

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex gap-4">
                    <div className="relative">
                        <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-16 h-16 rounded-2xl bg-muted object-cover border-2 border-background shadow-sm"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-background p-1 rounded-lg border shadow-sm">
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/10">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-[10px] font-bold text-yellow-600">{mentor.rating}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black tracking-tight">{mentor.name}</h3>
                            {mentor.linkedinUrl && (
                                <Link
                                    href={mentor.linkedinUrl}
                                    target="_blank"
                                    className="relative z-10 p-1.5 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 transition-all hover:scale-110"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{mentor.title} at <span className="font-bold text-foreground">{mentor.company}</span></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/80">
                            <Globe className="w-3 h-3" />
                            <span>{mentor.languages.join(", ")}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 mb-8 relative z-10 flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-2.5">
                    {mentor.expertise.map(skill => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1.5 bg-muted/50 hover:bg-muted font-bold text-[10px] uppercase tracking-wide">
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t relative z-10 mt-auto">
                <div className="text-sm">
                    <span className="font-black text-xl">₹{mentor.hourlyRate}</span>
                    <span className="text-muted-foreground font-medium text-xs ml-1.5">/ hour</span>
                </div>

                <Button
                    className="relative z-10 rounded-xl px-6 font-bold uppercase tracking-wide bg-[#FB923C] hover:bg-[#FB923C]/90 text-white shadow-lg shadow-[#FB923C]/20 transition-transform active:scale-95"
                    onClick={(e) => {
                        e.stopPropagation()
                        onBook?.(mentor)
                    }}
                >
                    Book Now
                </Button>
            </div>
        </div>
    )
}
