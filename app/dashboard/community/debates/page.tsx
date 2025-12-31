"use client"

import React from "react"
import { MessageSquare, Zap, ShieldAlert, ArrowLeft, TrendingUp, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export default function TechDebatesPage() {
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
    const [isCreateOpen, setIsCreateOpen] = React.useState(false)
    const [selectedDebate, setSelectedDebate] = React.useState<any>(null)
    const [newDebate, setNewDebate] = React.useState({ title: "", status: "Frameworks", content: "" })
    const [searchTerm, setSearchTerm] = React.useState("")
    const [debates, setDebates] = React.useState([
        {
            id: "d1",
            title: "JWT vs Cookies for Auth",
            author: "SystemWizard",
            votes: 42,
            comments: 156,
            hot: true,
            status: "High Stakes",
            content: "JWTs are often used for session management incorrectly. They were designed for stateless communication, not as a blanket session replacement. Discuss.",
            voted: 0,
            discussion: [
                { user: "CookieMonster", msg: "HttpOnly cookies are safer from XSS, period.", type: "Pro" },
                { user: "StatelessDev", msg: "Scaling sessions across multiple datacenters is a nightmare without JWTs.", type: "Counter" }
            ]
        },
        {
            id: "d2",
            title: "Microservices: When is it actually worth it?",
            author: "DevOpsPro",
            votes: 128,
            comments: 89,
            hot: false,
            status: "Architecture",
            content: "Monoliths are underrated. Microservices should be a result of organizational scaling, not a starting architecture.",
            voted: 0,
            discussion: [
                { user: "MicroMaster", msg: "Try scaling a dev team of 200 on a monolith and say that again.", type: "Counter" }
            ]
        },
        {
            id: "d3",
            title: "React Compiler: The end of manual memoization?",
            author: "FrontendElite",
            votes: 215,
            comments: 45,
            hot: true,
            status: "Frameworks",
            content: "React Forget (Compiler) might make useMemo and useCallback obsolete. Is this better DX or just hiding complexity?",
            voted: 0,
            discussion: [
                { user: "PerfPurist", msg: "I prefer control. Compilers can make unexpected decisions.", type: "Counter" }
            ]
        }
    ])

    React.useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('babua_debates')
        if (saved) {
            try {
                setDebates(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse debates", e)
            }
        }
    }, [])

    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem('babua_debates', JSON.stringify(debates))
        }
    }, [debates, mounted])

    const filteredDebates = debates.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleVote = (id: string, inc: number) => {
        const debate = debates.find(d => d.id === id)
        if (!debate) return

        if (debate.voted === inc) {
            handleUndoVote(id)
            return
        }

        const scoreAdjustment = debate.voted === 0 ? inc : inc * 2
        setDebates(prev => prev.map(d => d.id === id ? { ...d, voted: inc, votes: d.votes + scoreAdjustment } : d))

        toast.info(inc > 0 ? "Upvoted!" : "Downvoted!", {
            description: "Double-click the counter to undo your vote."
        })
    }

    const handleUndoVote = (id: string) => {
        const debate = debates.find(d => d.id === id)
        if (!debate || debate.voted === 0) return

        setDebates(prev => prev.map(d => d.id === id ? { ...d, votes: d.votes - d.voted, voted: 0 } : d))
        toast.error("Vote Centered")
    }

    const handleSubmitDebate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newDebate.title.trim()) return

        const debate = {
            id: `d${Date.now()}`,
            ...newDebate,
            author: "You",
            votes: 1,
            comments: 0,
            hot: false,
            voted: 1,
            discussion: []
        }
        setDebates([debate, ...debates])
        setNewDebate({ title: "", status: "Frameworks", content: "" })
        toast.success("Debate Started", {
            description: "The community is now weighing in on your topic."
        })
        setIsCreateOpen(false)
        setNewDebate({ title: "", status: "Frameworks", content: "" })
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="group text-muted-foreground hover:text-purple-500 -ml-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Hubs
                </Button>
                <Button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-purple-500 text-white hover:bg-purple-600 font-black uppercase rounded-xl h-10 px-6 text-xs shadow-lg shadow-purple-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Start Debate
                </Button>
            </div>

            <div className="space-y-4">
                <div className="w-16 h-16 rounded-[24px] bg-purple-500/10 flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">
                    Tech <span className="text-purple-500">Debates</span>
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                    High-stakes architecture discussions. No bikeshedding. Only production-grade insights.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[
                    { title: "Trending", value: "JWT vs Cookies", sub: "42 active arguments", icon: TrendingUp },
                    { title: "Hot Topic", value: "Microservices overhead", sub: "Verified engineers only", icon: ShieldAlert },
                    { title: "Live Now", value: "React Compiler Flow", sub: "15 mentors participating", icon: Zap }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[32px] border bg-card/50 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                            <stat.icon className="h-4 w-4 text-purple-500 opacity-50" />
                        </div>
                        <div className="text-xl font-black uppercase italic">{stat.value}</div>
                        <div className="text-[10px] font-bold text-purple-500/70">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Active Threads</h2>
                    <div className="flex flex-1 max-w-md relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                        <Input
                            placeholder="Search topics, authors or frameworks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-11 rounded-2xl bg-card border-border/50 focus:border-purple-500/50 transition-all font-medium text-xs italic"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="rounded-full px-4 text-[10px] uppercase font-black text-purple-500 border-purple-500/20">Trending</Badge>
                        <Badge variant="outline" className="rounded-full px-4 text-[10px] uppercase font-black opacity-40">Newest</Badge>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredDebates.map((debate) => (
                        <div key={debate.id} className="group p-6 rounded-[32px] border bg-card hover:border-purple-500/30 transition-all flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex flex-row md:flex-col items-center gap-3 md:gap-1 bg-muted/30 p-2 md:p-3 rounded-2xl min-w-[60px] select-none" onDoubleClick={() => handleUndoVote(debate.id)}>
                                <button
                                    onClick={() => handleVote(debate.id, 1)}
                                    className={cn("transition-colors", debate.voted === 1 ? "text-purple-500" : "hover:text-purple-500")}
                                >
                                    <TrendingUp className="h-5 w-5 md:rotate-[-90deg]" />
                                </button>
                                <span className={cn("text-lg font-black italic", debate.voted !== 0 && "text-purple-500")}>
                                    {debate.votes}
                                </span>
                                <button
                                    onClick={() => handleVote(debate.id, -1)}
                                    className={cn("transition-colors", debate.voted === -1 ? "text-red-500" : "hover:text-red-500")}
                                >
                                    <TrendingUp className="h-5 w-5 md:rotate-[90deg] opacity-40" />
                                </button>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[8px] font-black uppercase px-2">
                                        {debate.status}
                                    </Badge>
                                    {debate.hot && <span className="animate-pulse">🔥</span>}
                                </div>
                                <h3 className="text-xl font-black uppercase italic group-hover:text-purple-500 transition-colors leading-tight">
                                    {debate.title}
                                </h3>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>By @{debate.author}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {debate.comments}</span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setSelectedDebate(debate)}
                                className="rounded-full h-12 w-12 p-0 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all hidden md:flex items-center justify-center shadow-lg"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Debate Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-[450px] rounded-[32px] border-none shadow-2xl">
                    <DialogHeader className="space-y-3 pb-4">
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                            <Plus className="h-6 w-6 text-purple-500" /> Start <span className="text-purple-500">Debate</span>
                        </DialogTitle>
                        <DialogDescription className="font-medium text-sm text-muted-foreground/80">
                            Pitch a technical argument. Challenge the status quo.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitDebate} className="space-y-6 pt-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 opacity-60">Debate Topic</label>
                                <Input
                                    placeholder="e.g. Is Tailwind actually CSS?"
                                    value={newDebate.title}
                                    onChange={(e) => setNewDebate({ ...newDebate, title: e.target.value })}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-purple-500/50 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 opacity-60">Category</label>
                                <div className="relative group">
                                    <select
                                        className="w-full h-12 rounded-xl bg-muted/30 border border-border/50 px-4 text-sm font-bold focus:outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer pr-10 hover:bg-muted/50"
                                        value={newDebate.status}
                                        onChange={(e) => setNewDebate({ ...newDebate, status: e.target.value })}
                                    >
                                        <option className="bg-card text-foreground">Frameworks</option>
                                        <option className="bg-card text-foreground">Architecture</option>
                                        <option className="bg-card text-foreground">Databases</option>
                                        <option className="bg-card text-foreground">Cloud Native</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-500 group-hover:scale-110 transition-transform">
                                        <TrendingUp className="h-4 w-4 rotate-90 opacity-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 opacity-60">Your Contribution</label>
                                <Textarea
                                    placeholder="Lay out your initial argument or question here..."
                                    value={newDebate.content}
                                    onChange={(e) => setNewDebate({ ...newDebate, content: e.target.value })}
                                    className="min-h-[100px] rounded-xl bg-muted/30 border-border/50 focus:border-purple-500/50 transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-purple-500 text-white hover:bg-purple-600 font-black uppercase tracking-tight shadow-xl shadow-purple-500/20"
                        >
                            Ignite Thread
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Debate Detailed View */}
            <Dialog open={!!selectedDebate} onOpenChange={(open) => !open && setSelectedDebate(null)}>
                <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-0 rounded-[40px] shadow-2xl bg-card">
                    {selectedDebate && (
                        <div className="flex flex-col h-full">
                            <DialogHeader className="p-10 bg-purple-500/5 border-b border-border/50 text-left">
                                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px] font-black uppercase px-3 py-1 mb-4 h-auto w-fit">
                                    {selectedDebate.status}
                                </Badge>
                                <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-4">
                                    {selectedDebate.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                    <span>Authored by @{selectedDebate.author}</span>
                                    <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> {selectedDebate.comments} Contributions</span>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-10 space-y-8 flex-1 overflow-y-auto max-h-[60vh] scrollbar-thin">
                                <div className="p-8 rounded-[32px] bg-purple-500/10 border-2 border-purple-500/20 shadow-inner">
                                    <p className="text-xl font-black italic text-foreground leading-relaxed">
                                        "{selectedDebate.content}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Community Rebuttal & Support</h4>
                                    {(selectedDebate.discussion || []).map((msg: any, i: number) => (
                                        <div key={i} className={cn(
                                            "p-6 rounded-[24px] border transition-all",
                                            msg.type === "Pro" ? "bg-emerald-500/5 border-emerald-500/10" : "bg-red-500/5 border-red-500/10"
                                        )}>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-black uppercase text-foreground">@{msg.user}</span>
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase px-2 py-0 h-4",
                                                    msg.type === "Pro" ? "bg-emerald-500 text-black" : "bg-red-500 text-white"
                                                )}>
                                                    {msg.type} Position
                                                </Badge>
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                                                {msg.msg}
                                            </p>
                                        </div>
                                    ))}
                                    {(!selectedDebate.discussion || selectedDebate.discussion.length === 0) && (
                                        <div className="py-10 text-center border-2 border-dashed rounded-[32px] border-border/50">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No arguments indexed yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-8 bg-muted/20 border-t">
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Add your technical take..."
                                        className="h-14 rounded-2xl bg-card border-border/50 font-medium text-sm focus:border-purple-500/50"
                                    />
                                    <Button className="h-14 px-8 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-black uppercase tracking-tight shadow-xl shadow-purple-500/20">
                                        Argue
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
