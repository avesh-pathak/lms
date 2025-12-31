"use client"

import React from "react"
import { Users, Flame, BookOpen, MessageSquare, Newspaper, Zap, ArrowRight, ShieldCheck, Star, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function CommunityPage() {
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
    const [count, setCount] = React.useState(1240)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 2))
        }, 5000)
        return () => clearInterval(interval)
    }, [])
    const [sections, setSections] = React.useState([
        {
            id: "roast",
            title: "The Roast",
            desc: "Submit your resume or code to the Fire Pit for elite, no-sugar-coat feedback.",
            icon: Flame,
            href: "/dashboard/roast",
            status: "Active",
            color: "text-orange-500 bg-orange-500/10",
            notified: false
        },
        {
            id: "sprints",
            title: "Study Sprints",
            desc: "Join real-time, 48-hour intensive groups to master specific engineering topics.",
            icon: BookOpen,
            href: "/dashboard/community/sprints",
            status: "Coming Soon",
            color: "text-blue-500 bg-blue-500/10",
            notified: false
        },
        {
            id: "debates",
            title: "Tech Debates",
            desc: "Expert-level threads on high-stakes architecture decisions and patterns.",
            icon: MessageSquare,
            href: "/dashboard/community/debates",
            status: "Coming Soon",
            color: "text-purple-500 bg-purple-500/10",
            notified: false
        },
        {
            id: "logs",
            title: "Engineering Logs",
            desc: "A feed of daily technical insights from the community. Pure engineering, zero fluff.",
            icon: Newspaper,
            href: "/dashboard/community/logs",
            status: "Coming Soon",
            color: "text-emerald-500 bg-emerald-500/10",
            notified: false
        }
    ])

    React.useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('babua_community_auth')
        if (saved) {
            try {
                const authorizedIds = JSON.parse(saved)
                setSections(prev => prev.map(s =>
                    authorizedIds.includes(s.id) ? { ...s, notified: true, status: "Authorized" } : s
                ))
            } catch (e) {
                console.error("Failed to parse community auth", e)
            }
        }
    }, [])

    React.useEffect(() => {
        if (mounted) {
            const authorizedIds = sections.filter(s => s.notified).map(s => s.id)
            localStorage.setItem('babua_community_auth', JSON.stringify(authorizedIds))
        }
    }, [sections, mounted])

    const handleNotify = (id: string, title: string) => {
        setSections(prev => prev.map(s => {
            if (s.id === id) {
                if (!s.notified) {
                    toast.success(`${title} Unlocked!`, {
                        description: "You have been authorized to enter this hub early."
                    })
                    return { ...s, notified: true, status: "Authorized" }
                }
                return s
            }
            return s
        }))
    }

    const hubsRef = React.useRef<HTMLDivElement>(null)

    return (
        <div className="p-6 lg:p-10 space-y-12 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="relative group p-10 lg:p-12 rounded-[32px] overflow-hidden bg-card border shadow-xl">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-4 max-w-3xl">
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] px-4 py-1.5 h-auto">
                        The Engine Room
                    </Badge>
                    <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-none">
                        Community <br /> <span className="text-primary truncate">Verified.</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                        Where elite engineers collaborate, critique, and evolve. No noise, just collective growth.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            onClick={() => hubsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="h-12 px-6 rounded-xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-tight shadow-lg shadow-black/10 text-xs"
                        >
                            Explore All Hubs
                        </Button>
                        <div className="flex items-center gap-2 px-5 h-12 rounded-xl border bg-card/50 transition-all hover:border-primary/30">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">+{count.toLocaleString()} Verified Engineers</span>
                        </div>
                        {sections.some(s => s.notified) && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    localStorage.removeItem('babua_community_auth')
                                    window.location.reload()
                                }}
                                className="h-12 px-6 rounded-xl text-muted-foreground hover:text-red-500 font-black uppercase tracking-tight text-[10px]"
                            >
                                <LogOut className="mr-2 h-3.5 w-3.5" /> Reset Access
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hubs Grid */}
            <div ref={hubsRef} className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black uppercase tracking-tight italic">Available Hubs</h2>
                        <p className="text-muted-foreground font-medium uppercase tracking-widest text-[9px]">Select your area of contribution</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (section.status === "Active" || section.notified) {
                                    router.push(section.href)
                                } else {
                                    handleNotify(section.id, section.title)
                                }
                            }}
                            className={cn(
                                "group p-8 rounded-[40px] border bg-card/50 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden cursor-pointer",
                                section.status === "Coming Soon" && !section.notified && "opacity-90 grayscale-[0.2]",
                                section.notified && "border-emerald-500/30 bg-emerald-500/[0.02]"
                            )}
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <section.icon className={cn("h-12 w-12 opacity-10 transition-transform group-hover:scale-110", section.color.split(" ")[0])} />
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3 rounded-2xl", section.color)}>
                                        <section.icon className="h-6 w-6" />
                                    </div>
                                    <Badge className={cn(
                                        "font-black uppercase text-[8px] px-3 py-1",
                                        section.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                            section.status === "Authorized" ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30" :
                                                "bg-muted text-muted-foreground"
                                    )}>
                                        {section.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight italic">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm">
                                        {section.desc}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                                    {(section.status === "Active" || section.notified)
                                        ? "Enter Hub"
                                        : "Request Access"}
                                    <ArrowRight className={cn("h-3 w-3 group-hover:translate-x-1 transition-transform", section.notified && "text-emerald-500")} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community Values */}
            <div className="p-12 rounded-[48px] bg-muted/30 border border-dashed grid grid-cols-1 lg:grid-cols-3 gap-12">
                {[
                    { title: "Pure Engineering", desc: "No memes, no fluff. Just pure technical value.", icon: Zap },
                    { title: "No Ego", desc: "We critique the code, not the person. Growth is the only goal.", icon: ShieldCheck },
                    { title: "Verified Alpha", desc: "Insights verified by top-tier engineering mentors.", icon: Star }
                ].map((item, i) => (
                    <div key={i} className="space-y-4">
                        <div className="p-3 w-fit rounded-xl bg-background border shadow-sm">
                            <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
