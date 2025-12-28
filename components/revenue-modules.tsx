import React from "react"
import {
    Users,
    ShieldCheck,
    Zap,
    Star,
    MessageSquare,
    Rocket,
    Globe,
    Award
} from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export function MentorshipModule() {
    return (
        <div className="space-y-4">
            <div className="group relative p-6 rounded-[32px] bg-gradient-to-br from-[#FB923C]/10 via-background to-background border border-[#FB923C]/20 hover:border-[#FB923C]/40 transition-all overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                    <Users className="h-24 w-24 text-[#FB923C]" />
                </div>

                <div className="relative space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FB923C]/10 border border-[#FB923C]/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]">Priority Access</span>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight">Mentorship Hub</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[200px]">
                            Get 1-on-1 guidance from engineers at top tech companies.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-2xl bg-background/50 border border-border/50 text-center space-y-1">
                            <MessageSquare className="h-4 w-4 mx-auto text-[#FB923C]" />
                            <div className="text-[10px] font-black uppercase tracking-tight">Mock Interviews</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-background/50 border border-border/50 text-center space-y-1">
                            <Rocket className="h-4 w-4 mx-auto text-emerald-500" />
                            <div className="text-[10px] font-black uppercase tracking-tight">Career Prep</div>
                        </div>
                    </div>

                    <Button className="w-full h-12 rounded-2xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-white font-black uppercase tracking-widest shadow-lg shadow-[#FB923C]/20 transition-all hover:-translate-y-1">
                        Book a Session
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function ProofOfWorkModule() {
    return (
        <div className="space-y-4">
            <div className="group relative p-6 rounded-[32px] bg-gradient-to-br from-indigo-500/10 via-background to-background border border-indigo-500/20 hover:border-indigo-500/40 transition-all overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                    <ShieldCheck className="h-24 w-24 text-indigo-500" />
                </div>

                <div className="relative space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                        <Globe className="h-3 w-3 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Public Profile</span>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-black uppercase tracking-tight">Proof of Work</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-[200px]">
                            An immutable record of your engineering journey.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/50 border border-border/50">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <Award className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight">Skill Verification</div>
                                <div className="text-[9px] text-muted-foreground">DSA, System Design, LLD</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-background/50 border border-border/50">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-indigo-500" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-tight">Real Projects</div>
                                <div className="text-[9px] text-muted-foreground">Verified GitHub contributions</div>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full h-12 rounded-2xl border-indigo-500/50 text-indigo-500 font-black uppercase tracking-widest transition-all hover:bg-indigo-500 hover:text-white">
                        Access Profile
                    </Button>
                </div>
            </div>
        </div>
    )
}

export function PremiumBanner() {
    return (
        <div className="relative p-8 rounded-[40px] bg-foreground text-background overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Star className="h-32 w-32 fill-yellow-500 text-yellow-500" />
            </div>

            <div className="relative z-10 space-y-6 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Babua Pro</span>
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
                    ENGINEERING <br /> EXCELLENCE
                </h2>

                <p className="text-sm font-medium text-background/70 leading-relaxed">
                    Unlock advanced system design modules, priority mentorship, and early access to high-stakes hackathons.
                </p>

                <div className="flex items-center gap-4 pt-4">
                    <Button className="bg-white text-black hover:bg-white/90 rounded-2xl px-8 h-12 font-black uppercase tracking-widest">
                        Upgrade
                    </Button>
                    <div className="text-xs font-bold text-background/50 uppercase tracking-widest">
                        $10 / Month
                    </div>
                </div>
            </div>
        </div>
    )
}
