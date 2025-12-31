"use client"

import React from "react"
import { Newspaper, Zap, Flame, ArrowLeft, History, Heart, Share2, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export default function EngineeringLogsPage() {
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
    const [isWriteOpen, setIsWriteOpen] = React.useState(false)
    const [selectedLog, setSelectedLog] = React.useState<any>(null)
    const [newLog, setNewLog] = React.useState({ title: "", category: "Frontend", preview: "", content: "" })
    const [searchTerm, setSearchTerm] = React.useState("")
    const [logs, setLogs] = React.useState([
        {
            id: "l1",
            title: "React Hydration Mismatch: The Silent Performance Killer",
            author: "CodeMaster",
            likes: 124,
            category: "Frontend",
            time: "2h ago",
            preview: "After debugging for 6 hours, I finally found why our SSR was failing on production but not locally...",
            content: "Hydration mismatches happen when the server-rendered HTML doesn't match the initial client-side render. \n\nKey culprits: \n1. Using window/localStorage without checking for window existence. \n2. Inconsistent Date formatting between server and client. \n3. Browser extensions modifying the DOM.\n\nTip: Use the `useSyncExternalStore` hook or the `useEffect` trick for client-only components.",
            liked: false
        },
        {
            id: "l2",
            title: "Database Indexing: Why B-Trees aren't always enough",
            author: "DBArchitect",
            likes: 89,
            category: "Database",
            time: "5h ago",
            preview: "Standard indexing works for 90% of cases. But what happens when you hit 100M rows with complex joins?",
            content: "B-Trees are the bread and butter of RDBMS. However, they can fall short in several scenarios:\n\n- Low cardinality columns (use Bitmap indexes).\n- Extremely large datasets where index size exceeds memory.\n- Write-heavy workloads (where LSM trees shine).\n\nIf you're using Postgres, consider GIN or GiST indexes for specialized data types like JSONB or Geolocation data.",
            liked: false
        },
        {
            id: "l3",
            title: "Scaling WebSockets to 1M Concurrent Users",
            author: "InfraGenius",
            likes: 256,
            category: "Infrastructure",
            time: "Yesterday",
            preview: "The vertical scaling limit is real. Here's how we distributed our socket layer using Redis pub/sub...",
            content: "A single Node.js process can handle roughly 10k-50k concurrent sockets depending on the payload. To hit 1M, we need horizontal scaling.\n\nOur Architecture:\n- Nginx as a Load Balancer with IP hashing (session stickiness).\n- Multiple worker nodes running socket.io.\n- Redis Adapter for cross-process communication.\n\nCritical Lesson: Monitor your file descriptor limits (`ulimit -n`) and memory usage per connection.",
            liked: false
        }
    ])

    React.useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('babua_logs')
        if (saved) {
            try {
                setLogs(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse logs", e)
            }
        }
    }, [])

    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem('babua_logs', JSON.stringify(logs))
        }
    }, [logs, mounted])

    const filteredLogs = logs.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleLike = (id: string) => {
        const log = logs.find(l => l.id === id)
        if (!log || log.liked) return

        setLogs(prev => prev.map(l => l.id === id ? { ...l, liked: true, likes: l.likes + 1 } : l))
        toast.success("Log Liked", {
            description: "Double-click to unlike."
        })
    }

    const handleUnlike = (id: string) => {
        const log = logs.find(l => l.id === id)
        if (!log || !log.liked) return

        setLogs(prev => prev.map(l => l.id === id ? { ...l, liked: false, likes: l.likes - 1 } : l))
        toast.error("Like Removed")
    }

    const handleSubmitLog = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newLog.title.trim() || !newLog.preview.trim()) return

        const entry = {
            id: `l${Date.now()}`,
            title: newLog.title,
            author: "You",
            likes: 0,
            category: newLog.category,
            time: "Just now",
            preview: newLog.preview,
            content: newLog.content || newLog.preview, // Fallback if content is empty
            liked: false
        }

        setLogs(prev => [entry, ...prev])
        toast.success("Log Published", {
            description: "Your technical insight is now live in the engine room."
        })
        setIsWriteOpen(false)
        setNewLog({ title: "", category: "Frontend", preview: "", content: "" })
    }

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="group text-muted-foreground hover:text-emerald-500 -ml-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Hubs
                </Button>
                <Button
                    onClick={() => setIsWriteOpen(true)}
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-black uppercase rounded-xl h-10 px-6 text-xs shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="mr-2 h-4 w-4" /> Write Log
                </Button>
            </div>

            <div className="space-y-4">
                <div className="w-14 h-14 rounded-[20px] bg-emerald-500/10 flex items-center justify-center">
                    <Newspaper className="h-7 w-7 text-emerald-500" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">
                    Engineering <span className="text-emerald-500">Logs</span>
                </h1>
                <p className="text-muted-foreground font-medium text-lg max-w-2xl">
                    Raw, unfiltered technical insights from the elite community.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[
                    { title: "Daily Logs", value: "85 New Entries", sub: "Last updated 5m ago", icon: History },
                    { title: "Trending Bug", value: "Hydration Mismatch", sub: "12 detailed fixes logged", icon: Flame },
                    { title: "Top Insight", value: "DB Indexing Logic", sub: "Written by CleanCoder", icon: Zap }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-[32px] border bg-card/50 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                            <stat.icon className="h-4 w-4 text-emerald-500 opacity-50" />
                        </div>
                        <div className="text-xl font-black uppercase italic">{stat.value}</div>
                        <div className="text-[10px] font-bold text-emerald-500/70">{stat.sub}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-6 pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Recent Entries</h2>
                    <div className="flex flex-1 max-w-md relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                        <Input
                            placeholder="Search insights, authors or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-11 rounded-2xl bg-card border-border/50 focus:border-emerald-500/50 transition-all font-medium text-xs italic"
                        />
                    </div>
                    <div className="flex gap-4 text-[10px] font-black uppercase text-muted-foreground">
                        <span className="text-emerald-500 border-b-2 border-emerald-500 pb-1 cursor-pointer">All Logs</span>
                        <span className="hover:text-emerald-500 cursor-pointer transition-colors">My Subscriptions</span>
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredLogs.map((log) => (
                        <div key={log.id} className="group p-8 rounded-[40px] border bg-card hover:border-emerald-500/30 transition-all space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase px-2">
                                        {log.category}
                                    </Badge>
                                    <span className="text-[10px] font-black text-muted-foreground uppercase">{log.time}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleLike(log.id)}
                                        onDoubleClick={() => handleUnlike(log.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 text-[10px] font-black uppercase transition-colors",
                                            log.liked ? "text-red-500" : "hover:text-red-500"
                                        )}
                                    >
                                        <Heart className={cn("h-4 w-4", log.liked && "fill-current")} /> {log.likes}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase hover:text-emerald-500 transition-colors">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase italic leading-tight group-hover:text-emerald-500 transition-colors">
                                    {log.title}
                                </h3>
                                <p className="text-sm text-muted-foreground font-medium line-clamp-2 leading-relaxed">
                                    {log.preview}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-dashed">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px] font-black text-emerald-500">
                                        {log.author[0]}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">@{log.author}</span>
                                </div>
                                <Button
                                    variant="link"
                                    onClick={() => setSelectedLog(log)}
                                    className="text-emerald-500 font-black uppercase text-[10px] p-0 h-auto hover:no-underline hover:opacity-80"
                                >
                                    Read Full Log
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Log Dialog */}
            <Dialog open={isWriteOpen} onOpenChange={setIsWriteOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl">
                    <DialogHeader className="space-y-3 pb-4">
                        <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                            <Plus className="h-6 w-6 text-emerald-500" /> Write <span className="text-emerald-500">Log</span>
                        </DialogTitle>
                        <DialogDescription className="font-medium text-sm">
                            Share high-density technical insights. Zero fluff, only engineering.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitLog} className="space-y-6 pt-2">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-60">Log Title</label>
                                <Input
                                    placeholder="e.g. React Hydration Fixes"
                                    value={newLog.title}
                                    onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-60">Category</label>
                                <div className="relative group">
                                    <select
                                        className="w-full h-12 rounded-xl bg-muted/30 border border-border/50 px-4 text-sm font-bold focus:outline-none focus:border-emerald-500/50 transition-all appearance-none cursor-pointer pr-10 hover:bg-muted/50"
                                        value={newLog.category}
                                        onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                                    >
                                        <option className="bg-card text-foreground">Frontend</option>
                                        <option className="bg-card text-foreground">Backend</option>
                                        <option className="bg-card text-foreground">Infrastructure</option>
                                        <option className="bg-card text-foreground">Database</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500 group-hover:scale-110 transition-transform">
                                        <Zap className="h-4 w-4 opacity-50 fill-current" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-60">Insight Preview</label>
                                <Input
                                    placeholder="Brief summary (e.g. Found a memory leak in...)"
                                    value={newLog.preview}
                                    onChange={(e) => setNewLog({ ...newLog, preview: e.target.value })}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50 focus:border-emerald-500/50 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-60">Full Engineering Analysis</label>
                                <Textarea
                                    placeholder="Detailed technical breakdown, code snippets, or architecture tips..."
                                    value={newLog.content}
                                    onChange={(e) => setNewLog({ ...newLog, content: e.target.value })}
                                    className="min-h-[160px] rounded-xl bg-muted/30 border-border/50 focus:border-emerald-500/50 transition-all resize-none font-medium leading-relaxed"
                                    required
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-14 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 font-black uppercase tracking-tight shadow-xl shadow-emerald-500/20"
                        >
                            Publish Log
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Detailed Log View */}
            <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background/95 backdrop-blur-xl shadow-2xl rounded-[40px] gap-0 scrollbar-hide">
                    {selectedLog && (
                        <>
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                            <DialogHeader className="p-8 pb-4 border-b bg-muted/20 relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase px-3 py-1 h-auto w-fit">
                                        {selectedLog.category}
                                    </Badge>
                                </div>
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic leading-none break-words">
                                    {selectedLog.title}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <span className="flex items-center gap-1"><History className="h-3 w-3" /> {selectedLog.time}</span>
                                    <span className="text-emerald-500">Authored by @{selectedLog.author}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-8 space-y-10 relative">
                                <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Executive Summary</span>
                                    <p className="text-lg font-black italic leading-tight text-emerald-900/80 dark:text-emerald-400">
                                        "{selectedLog.preview}"
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="h-px flex-1 bg-border" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4">Detailed Deep Dive</span>
                                        <span className="h-px flex-1 bg-border" />
                                    </div>

                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
                                            {selectedLog.content || "Full analysis pending system sync..."}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-10 border-t">
                                    <Button
                                        className={cn(
                                            "flex-1 h-14 rounded-2xl font-black uppercase tracking-tight shadow-xl transition-all",
                                            selectedLog.liked ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                                        )}
                                        onClick={() => handleLike(selectedLog.id)}
                                    >
                                        <Zap className="mr-2 h-5 w-5 fill-current" />
                                        {selectedLog.liked ? "Log Supported" : "Support Analysis"}
                                    </Button>
                                    <Button variant="outline" className="h-14 w-14 rounded-2xl shrink-0" onClick={() => setSelectedLog(null)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
