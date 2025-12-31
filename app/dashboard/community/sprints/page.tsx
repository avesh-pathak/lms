"use client"

import React from "react"
import { Plus, Users, Timer, BookOpen, Target, ArrowLeft, Search, Terminal, MessageSquare, FileText, X, Send, Zap, Flame, TerminalSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export default function StudySprintsPage() {
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [selectedSquad, setSelectedSquad] = React.useState<any>(null)
    const [activeArenaSquad, setActiveArenaSquad] = React.useState<any>(null)
    const [newSprint, setNewSprint] = React.useState({ title: "", level: "Intermediate" })
    const [searchTerm, setSearchTerm] = React.useState("")
    const [squads, setSquads] = React.useState([
        {
            id: "s1",
            title: "System Design Capstone",
            members: 12,
            capacity: 15,
            level: "Senior+",
            startTime: "2d 14h",
            active: false,
            joined: false
        },
        {
            id: "s2",
            title: "LLD: Patterns & SOLID",
            members: 8,
            capacity: 10,
            level: "Intermediate",
            startTime: "LIVE",
            active: true,
            joined: false
        },
        {
            id: "s3",
            title: "Advanced React Patterns",
            members: 15,
            capacity: 20,
            level: "Expert",
            startTime: "4h 12m",
            active: false,
            joined: false
        }
    ])

    React.useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('babua_sprints')
        if (saved) {
            try {
                setSquads(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse sprints", e)
            }
        }
    }, [])

    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem('babua_sprints', JSON.stringify(squads))
        }
    }, [squads, mounted])

    const filteredSquads = squads.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.level.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAction = (id: string, title: string) => {
        const squad = squads.find(s => s.id === id)
        if (!squad) return

        if (squad.joined) {
            setActiveArenaSquad(squad)
            toast.success(`Entering Arena: ${title}`, {
                description: "Syncing your position with the squad."
            })
        } else {
            setSquads(prev => prev.map(s => s.id === id ? { ...s, joined: true, members: s.members + 1 } : s))
            toast.success(`Reserved Seat: ${title}`, {
                description: "Double-click the button if you wish to undo this registration."
            })
        }
    }

    const handleUndo = (id: string, title: string) => {
        const squad = squads.find(s => s.id === id)
        if (!squad || !squad.joined) return

        setSquads(prev => prev.map(s => s.id === id ? { ...s, joined: false, members: s.members - 1 } : s))
        toast.error(`Registration Cancelled`, {
            description: `You have left the ${title} squad.`
        })
    }

    const handleSubmitSprint = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newSprint.title.trim()) return

        const squad = {
            id: `s${Date.now()}`,
            title: newSprint.title,
            members: 1,
            capacity: 8,
            level: newSprint.level,
            startTime: "Starting soon",
            active: true,
            joined: true
        }

        setSquads(prev => [squad, ...prev])
        toast.success("Sprint Proposed", {
            description: "Your squad is now open for elite builders to join."
        })
        setIsCreateOpen(false)
        setNewSprint({ title: "", level: "Intermediate" })
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="group text-muted-foreground hover:text-blue-500 -ml-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Hubs
                </Button>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-blue-500 text-white hover:bg-blue-600 font-black uppercase rounded-xl h-10 px-6 text-xs shadow-lg shadow-blue-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Proposed Sprint
                </Button>
            </div>

            <div className="space-y-4">
                <div className="w-14 h-14 rounded-[20px] bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="h-7 w-7 text-blue-500" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">
                    Study <span className="text-blue-500">Sprints</span>
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                    Intensive, 48-hour collaborative learning bursts. Master a topic with a squad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[
                    { title: "Next Sprint", value: "System Design Capstone", sub: "Starting in 2d 14h", icon: Timer },
                    { title: "Active Squads", value: "12 Groups", sub: "48 builders currently live", icon: Users },
                    { title: "Mastery Level", value: "Senior+", sub: "Prerequisite: Core Engineering", icon: Target }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[32px] border bg-card/50 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                            <stat.icon className="h-4 w-4 text-blue-500 opacity-50" />
                        </div>
                        <div className="text-xl font-black uppercase italic">{stat.value}</div>
                        <div className="text-[10px] font-bold text-blue-500/70">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Upcoming Squads</h2>
                    <div className="flex flex-1 max-w-md relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search squads or levels..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-11 rounded-2xl bg-card border-border/50 focus:border-blue-500/50 transition-all font-medium text-xs italic"
                        />
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 text-[10px] uppercase font-black text-blue-500 border-blue-500/20 animate-pulse">Joinable Now</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSquads.map((squad) => (
                        <div key={squad.id} className="group p-8 rounded-[40px] border bg-card hover:border-blue-500/30 transition-all space-y-6 relative overflow-hidden">
                            {squad.active && (
                                <div className="absolute top-0 right-0 p-6">
                                    <div className="bg-emerald-500 h-2 w-2 rounded-full animate-ping" />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] font-black uppercase px-2">
                                        {squad.level}
                                    </Badge>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                                        {squad.startTime === "LIVE" ? "🔴 Live Interaction" : `⏳ Starts ${squad.startTime}`}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black uppercase italic leading-tight group-hover:text-blue-500 transition-colors">
                                    {squad.title}
                                </h3>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex -space-x-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-black">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                    <div className="h-8 w-8 rounded-full border-2 border-card bg-blue-500/10 text-blue-500 flex items-center justify-center text-[10px] font-black">
                                        +{squad.members - 3}
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                                    {squad.members} / {squad.capacity} Builders
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 w-full">
                                <Button
                                    onClick={() => handleAction(squad.id, squad.title)}
                                    onDoubleClick={() => handleUndo(squad.id, squad.title)}
                                    disabled={!squad.joined && squad.members >= squad.capacity}
                                    className={cn(
                                        "w-full font-black uppercase rounded-2xl h-12 transition-all",
                                        squad.joined
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    )}
                                >
                                    {squad.joined
                                        ? "Enter Arena"
                                        : (squad.members >= squad.capacity ? "Squad Full" : "Reserve Seat")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedSquad(squad)}
                                    className="h-10 px-4 rounded-xl font-black uppercase text-[10px] border-blue-500/20 hover:bg-blue-500/5 transition-all w-full"
                                >
                                    View Squad Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Proposed Sprint Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none shadow-2xl">
                    <DialogHeader className="space-y-3 pb-4">
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                            <Plus className="h-6 w-6 text-blue-500" /> Propose <span className="text-blue-500">Sprint</span>
                        </DialogTitle>
                        <DialogDescription className="font-medium text-sm text-muted-foreground/80">
                            Assemble an elite squad for deep focus.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitSprint} className="space-y-6 pt-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-60">Sprint Topic</label>
                                <Input
                                    placeholder="e.g. K8s Networking Deep-dive"
                                    value={newSprint.title}
                                    onChange={(e) => setNewSprint({ ...newSprint, title: e.target.value })}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-blue-500/50 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-500 opacity-60">Builder Level</label>
                                <div className="relative group">
                                    <select
                                        className="w-full h-12 rounded-xl bg-muted/30 border border-border/50 px-4 text-sm font-bold focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer pr-10 hover:bg-muted/50"
                                        value={newSprint.level}
                                        onChange={(e) => setNewSprint({ ...newSprint, level: e.target.value })}
                                    >
                                        <option className="bg-card text-foreground">Beginner</option>
                                        <option className="bg-card text-foreground">Intermediate</option>
                                        <option className="bg-card text-foreground">Advanced</option>
                                        <option className="bg-card text-foreground">L-9 Elite</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 group-hover:scale-110 transition-transform">
                                        <Target className="h-4 w-4 opacity-50" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-blue-500 text-white hover:bg-blue-600 font-black uppercase tracking-tight shadow-xl shadow-blue-500/20"
                        >
                            Open Squad
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Squad Detailed View */}
            <Dialog open={!!selectedSquad} onOpenChange={(open) => !open && setSelectedSquad(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background/95 backdrop-blur-xl shadow-2xl rounded-[40px] gap-0 scrollbar-hide">
                    {selectedSquad && (
                        <>
                            {/* Engineering Grid Background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <DialogHeader className="p-8 pb-4 border-b bg-muted/20 relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase px-3 py-1 h-auto">
                                        {selectedSquad.level}
                                    </Badge>
                                    <Badge variant="outline" className="border-blue-500/20 text-blue-500 font-bold text-[10px] px-3 py-1 h-auto bg-white/50">
                                        {selectedSquad.members}/{selectedSquad.capacity} Builders Joined
                                    </Badge>
                                </div>
                                <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter leading-none break-words">
                                    {selectedSquad.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <span className="flex items-center gap-1.5 font-black text-blue-500"><Timer className="h-4 w-4" /> {selectedSquad.startTime}</span>
                                    <span className="flex items-center gap-1.5 font-black text-blue-500"><BookOpen className="h-4 w-4" /> Deep Focus Mode</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-8 space-y-10 relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[32px] bg-blue-500/5 border border-blue-500/10 space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Current Mission</h4>
                                        <p className="text-lg font-black italic leading-tight text-blue-900/80 dark:text-blue-200">
                                            "Co-building production-grade systems with peer review."
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-[32px] bg-[#FB923C]/5 border border-[#FB923C]/10 space-y-3">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]">Requirements</h4>
                                        <p className="text-lg font-black italic leading-tight text-[#FB923C]/80">
                                            "Proof of Work history and verified Git profile required."
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-10 border-t">
                                    <Button
                                        className={cn(
                                            "flex-1 h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl transition-all",
                                            selectedSquad.joined ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20"
                                        )}
                                        onClick={() => {
                                            handleAction(selectedSquad.id, selectedSquad.title)
                                            setSelectedSquad(null)
                                        }}
                                    >
                                        <Zap className="mr-2 h-5 w-5 fill-current" />
                                        {selectedSquad.joined ? "Enter Arena" : "Join Squad"}
                                    </Button>
                                    <Button variant="outline" className="h-14 w-14 rounded-2xl shrink-0" onClick={() => setSelectedSquad(null)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            {/* Sprint Arena Overlay */}
            {activeArenaSquad && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in zoom-in duration-300 overflow-hidden scrollbar-hide">
                    {/* Engineering Grid Background */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    {/* Arena Header */}
                    <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-black/50 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 animate-pulse">
                                    <Zap className="h-5 w-5 fill-current" />
                                </div>
                                <div className="space-y-0.5">
                                    <h2 className="text-xl font-black uppercase italic tracking-tight text-white leading-none">
                                        {activeArenaSquad.title}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500 text-black text-[8px] font-black uppercase h-4 px-2">Live Session</Badge>
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                            Established {activeArenaSquad.startTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-8 bg-white/10" />
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground ring-2 ring-emerald-500/20 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + activeArenaSquad.id}`} alt="User" />
                                    </div>
                                ))}
                                <div className="h-8 w-8 rounded-full border-2 border-black bg-emerald-500 flex items-center justify-center text-[10px] font-black text-black z-10">
                                    +{activeArenaSquad.members - 5}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveArenaSquad(null)}
                            className="text-white/40 hover:text-white hover:bg-white/10 rounded-xl"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Arena Body */}
                    <div className="flex-1 flex overflow-hidden lg:p-6 gap-6">
                        {/* Left: Terminal / Console */}
                        <div className="flex-[2] flex flex-col gap-6">
                            <div className="flex-1 bg-black rounded-[32px] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                                <div className="h-10 bg-white/5 px-6 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <TerminalSquare className="h-4 w-4 text-emerald-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">Distributed Console</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                    </div>
                                </div>
                                <div className="flex-1 p-8 font-mono text-sm space-y-2 overflow-y-auto">
                                    <div className="text-emerald-500/80">$ babua-cli deploy --target arena</div>
                                    <div className="text-white/60">Initializing squad synchronization... [DONE]</div>
                                    <div className="text-white/60">Fetching shared memory clusters... [DONE]</div>
                                    <div className="text-emerald-400 font-bold">Successfully connected to "{activeArenaSquad.title}" node.</div>
                                    <div className="text-white/40 italic pt-4"># Waiting for architectural blueprint...</div>
                                    <div className="text-white/60 flex items-center gap-2">
                                        <span className="text-red-400 font-black">@SystemArchitect:</span>
                                        "Let's focus on the message broker implementation first."
                                    </div>
                                    <div className="text-emerald-500 animate-pulse">$ _</div>
                                </div>
                            </div>

                            <div className="h-48 bg-white/5 rounded-[32px] border border-white/10 p-8 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Active Task</h4>
                                    <p className="text-lg font-black text-white uppercase italic tracking-tighter">
                                        Implement Consistent Hashing Algorithm
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <span className="text-xs font-black text-emerald-500">65% SYNCED</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Interaction Side */}
                        <div className="flex-1 flex flex-col gap-6 min-w-[400px]">
                            {/* Collaborative Chat */}
                            <div className="flex-1 bg-white/5 rounded-[32px] border border-white/10 flex flex-col overflow-hidden">
                                <div className="p-6 border-b border-white/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                                        <MessageSquare className="h-3 w-3" /> Arena Communcation
                                    </h4>
                                </div>
                                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                                    {[
                                        { user: "InfraGenius", msg: "I've optimized the ingress controller.", time: "1m ago" },
                                        { user: "DBArchitect", msg: "Replication lag is down to 2ms.", time: "Now" }
                                    ].map((msg, i) => (
                                        <div key={i} className="space-y-1">
                                            <div className="flex justify-between items-baseline">
                                                <span className="text-[10px] font-black uppercase text-emerald-500">@{msg.user}</span>
                                                <span className="text-[8px] text-white/20">{msg.time}</span>
                                            </div>
                                            <p className="text-xs text-white/80 font-medium leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
                                                {msg.msg}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-black/40 border-t border-white/10">
                                    <div className="relative">
                                        <Input
                                            placeholder="Broadcast to squad..."
                                            className="h-12 bg-white/5 border-white/10 rounded-xl pr-12 text-xs font-medium focus:border-emerald-500/50"
                                        />
                                        <Button size="icon" className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Resource Hub */}
                            <div className="h-64 bg-emerald-500 rounded-[32px] p-8 flex flex-col justify-between group overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:rotate-12">
                                    <FileText className="h-24 w-24 text-black" />
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="h-10 w-10 rounded-xl bg-black/10 flex items-center justify-center">
                                        <Target className="h-5 w-5 text-black" />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black leading-tight">
                                        Squad <br /> Resources
                                    </h3>
                                </div>
                                <Button className="w-full bg-black text-white hover:bg-black/90 font-black uppercase tracking-tight h-12 rounded-xl text-[10px] relative z-10">
                                    Open Shared Docs
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
