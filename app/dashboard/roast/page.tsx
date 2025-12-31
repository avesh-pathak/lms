"use client"

import React, { useState } from "react"
import { Flame, MessageSquare, Plus, Search, Trophy, History, ShieldAlert, Zap, ArrowRight, ArrowLeft, Share2, MoreVertical, X, Send, PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { MOCK_ROASTS, type RoastSubmission, type RoastComment } from "@/lib/data/community"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function RoastPage() {
    const [mounted, setMounted] = React.useState(false)
    const [roasts, setRoasts] = useState<RoastSubmission[]>(MOCK_ROASTS)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [uploadTitle, setUploadTitle] = useState("")
    const [editingRoast, setEditingRoast] = useState<RoastSubmission | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const router = useRouter()

    const selectedRoast = roasts.find(r => r.id === selectedId) || null

    React.useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('babua_roasts')
        if (saved) {
            try {
                setRoasts(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse roasts", e)
            }
        }
    }, [])

    React.useEffect(() => {
        if (mounted) {
            localStorage.setItem('babua_roasts', JSON.stringify(roasts))
        }
    }, [roasts, mounted])

    const filteredRoasts = roasts.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.builder.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim() || !selectedId) return

        const comment: RoastComment = {
            id: Date.now().toString(),
            userName: "You",
            avatar: "/assets/mentors/image.png",
            content: newComment,
            burnLevel: "Hot",
            createdAt: new Date().toISOString()
        }

        setRoasts(prev => prev.map(r => {
            if (r.id === selectedId) {
                return {
                    ...r,
                    roastCount: r.roastCount + 1,
                    burnCount: r.burnCount + 5,
                    comments: [comment, ...r.comments]
                }
            }
            return r
        }))

        toast.success("Burn added!", {
            description: "Your roast has been submitted to the fire pit."
        })
        setNewComment("")
    }

    const getRelativeTime = (dateString: string) => {
        const now = new Date()
        const then = new Date(dateString)
        const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

        if (diffInSeconds < 60) return "just now"
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    const handleDownload = (roast: RoastSubmission) => {
        // Mock download logic
        const blob = new Blob(["Mock Resume Content for " + roast.title], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${roast.fileName || roast.title.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success("Downloading " + roast.title)
    }

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault()
        if (!uploadTitle.trim()) return

        if (editingRoast) {
            setRoasts(prev => prev.map(r => r.id === editingRoast.id ? { ...r, title: uploadTitle } : r))
            toast.success("Roast updated!")
        } else {
            const newRoast: RoastSubmission = {
                id: Date.now().toString(),
                title: uploadTitle,
                builder: "You",
                avatar: "/assets/mentors/image.png",
                resumeUrl: "#",
                fileName: selectedFile?.name,
                burnCount: 0,
                roastCount: 0,
                status: "Fresh",
                comments: []
            }
            setRoasts(prev => [newRoast, ...prev])
            toast.success("Submission received!", {
                description: "Prepare yourself, the roast is coming."
            })
        }

        setIsUploadOpen(false)
        setUploadTitle("")
        setEditingRoast(null)
        setSelectedFile(null)
    }

    if (!mounted) return null

    return (
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
            <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/community')}
                className="group text-muted-foreground hover:text-[#FB923C] -ml-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Hubs
            </Button>

            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 border-b pb-6 border-border/50">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[20px] bg-[#FB923C]/10 flex items-center justify-center shrink-0">
                        <Flame className="h-8 w-8 text-[#FB923C] animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic text-foreground leading-none whitespace-nowrap">
                            The Roast
                        </h1>
                        <p className="text-muted-foreground font-bold text-[13px] lg:text-sm mt-3">
                            Submit your resume to the <span className="text-[#FB923C] underline decoration-[#FB923C]/30 underline-offset-4">Fire Pit</span>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-[#FB923C] transition-colors" />
                        <Input
                            placeholder="Find a victim..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 rounded-xl border-border/50 bg-card hover:border-[#FB923C]/30 focus:border-[#FB923C] transition-all text-sm"
                        />
                    </div>
                    <Button
                        onClick={() => setIsUploadOpen(true)}
                        className="h-12 px-6 rounded-xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-white font-black uppercase tracking-tight shadow-md shadow-[#FB923C]/20 shrink-0 text-xs"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Submit Resume
                    </Button>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRoasts.map((roast) => (
                    <Card
                        key={roast.id}
                        onClick={() => setSelectedId(roast.id)}
                        className="group relative overflow-hidden rounded-[32px] border-2 border-border/50 bg-card hover:border-[#FB923C]/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#FB923C]/10"
                    >
                        <div className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn(
                                            "font-black uppercase text-[10px] tracking-widest px-3 py-1 border-0",
                                            roast.status === "On Fire" ? "bg-red-500 text-white animate-pulse" : "bg-blue-500 text-white"
                                        )}>
                                            {roast.status}
                                        </Badge>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#FB923C] uppercase tracking-widest">
                                            <Flame className="h-3 w-3" /> {roast.burnCount} Burns
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight leading-none group-hover:text-[#FB923C] transition-colors">
                                        {roast.title}
                                    </h3>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-[#FB923C]/10 transition-all">
                                    <ShieldAlert className="h-5 w-5 text-muted-foreground group-hover:text-[#FB923C]" />
                                </div>
                            </div>

                            <p className="text-sm font-medium text-muted-foreground line-clamp-2 italic">
                                "{roast.comments[0]?.content || "No burns yet. Be the first."}"
                            </p>

                            <div className="pt-4 flex items-center justify-between border-t border-border/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-indigo-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{roast.builder}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase">
                                    View Roasts <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
                <DialogContent showCloseButton={false} className="sm:max-w-[1000px] p-0 overflow-hidden border-0 rounded-[40px] shadow-2xl bg-card">
                    {selectedRoast && (
                        <>
                            <DialogHeader className="sr-only">
                                <DialogTitle>{selectedRoast.title}</DialogTitle>
                                <DialogDescription>Detailed resume roast and community feedback for {selectedRoast.builder}</DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col md:flex-row h-[80vh]">
                                {/* Resume Preview Side */}
                                <div className="flex-1 bg-muted/30 p-8 flex flex-col items-center justify-center border-r border-border/50 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FB923C]/5 to-transparent pointer-events-none" />
                                    <div className="w-full h-full rounded-2xl border-4 border-dashed border-border/50 flex flex-col items-center justify-center gap-4 bg-white/50 dark:bg-black/20 relative z-10 backdrop-blur-sm">
                                        <div className="p-6 rounded-full bg-muted/50">
                                            <History className="h-12 w-12 text-muted-foreground opacity-20" />
                                        </div>
                                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/40 italic">Resume Preview Protected</p>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl border-2 font-black uppercase text-xs h-10 px-6"
                                            onClick={() => handleDownload(selectedRoast)}
                                        >
                                            Download PDF
                                        </Button>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between w-full relative z-10">
                                        <div className="flex items-center gap-4">
                                            <Badge className="bg-[#FB923C] text-white font-black uppercase text-[10px] px-4 py-1.5 h-auto">On the Pit</Badge>
                                            <h2 className="text-xl font-black uppercase tracking-tight">{selectedRoast.title}</h2>
                                        </div>
                                        <Button variant="ghost" size="icon" className="rounded-full">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Roasts Feed Side */}
                                <div className="w-full md:w-[400px] flex flex-col bg-card">
                                    <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#FB923C]/10 flex items-center justify-center">
                                                <Flame className="h-5 w-5 text-[#FB923C]" />
                                            </div>
                                            <h3 className="font-black uppercase tracking-tight italic">Feedback Loop</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="font-black text-[10px] uppercase bg-muted/50 border-0">{selectedRoast.roastCount} Burns</Badge>
                                            {selectedRoast.builder === "You" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-orange-500/10 hover:text-[#FB923C]"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setEditingRoast(selectedRoast)
                                                        setUploadTitle(selectedRoast.title)
                                                        setIsUploadOpen(true)
                                                    }}
                                                >
                                                    <PenLine className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-full"
                                                onClick={() => setSelectedId(null)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                                        {selectedRoast.comments.map((comment, i) => (
                                            <div key={comment.id} className="space-y-3 group animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase text-[#FB923C] tracking-widest">{comment.userName}</span>
                                                        <Badge className={cn(
                                                            "text-[8px] h-4 py-0 uppercase font-black px-1.5",
                                                            comment.burnLevel === "Supernova" ? "bg-red-500" :
                                                                comment.burnLevel === "Hot" ? "bg-orange-500" : "bg-blue-500"
                                                        )}>
                                                            {comment.burnLevel}
                                                        </Badge>
                                                    </div>
                                                    <span className="text-[8px] font-black text-muted-foreground uppercase opacity-40">{getRelativeTime(comment.createdAt)}</span>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-muted/40 border border-border/30 group-hover:border-[#FB923C]/30 transition-all relative">
                                                    <div className="text-[13px] font-medium leading-relaxed italic text-foreground/90">
                                                        "{comment.content}"
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 bg-background/50 backdrop-blur-md border-t border-border/50">
                                        <form onSubmit={handleAddComment} className="relative group">
                                            <Input
                                                placeholder="Write a roast..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="h-12 rounded-2xl bg-muted/40 border-border/50 pr-12 text-[13px] font-medium focus:border-[#FB923C] transition-all"
                                            />
                                            <Button
                                                type="submit"
                                                size="icon"
                                                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-[#FB923C] hover:bg-[#FB923C]/90 text-white shadow-lg shadow-[#FB923C]/20"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </form>
                                        <p className="mt-3 text-[9px] font-black text-center text-muted-foreground uppercase tracking-widest opacity-40">Keep it professional. But keep it spicy.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={(open) => {
                setIsUploadOpen(open)
                if (!open) {
                    setEditingRoast(null)
                    setUploadTitle("")
                    setSelectedFile(null)
                }
            }}>
                <DialogContent className="sm:max-w-[450px] rounded-[32px]">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                            <Plus className="h-6 w-6 text-[#FB923C]" /> {editingRoast ? "Edit Your Roast" : "Submit Your Work"}
                        </DialogTitle>
                        <DialogDescription className="font-medium text-sm">
                            {editingRoast ? "Update your resume details for a fresh round of feedback." : "Ready for clinical-grade feedback? Upload your resume and let the elite roast begin."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-6 pt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]">Resume Title</label>
                                <Input
                                    placeholder="e.g. Frontend Architect v2"
                                    value={uploadTitle}
                                    onChange={(e) => setUploadTitle(e.target.value)}
                                    className="h-12 rounded-xl bg-muted/30 border-border/50"
                                    required
                                />
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "h-40 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
                                    selectedFile
                                        ? "bg-green-500/5 border-green-500/30"
                                        : "bg-muted/10 border-border hover:bg-[#FB923C]/5 hover:border-[#FB923C]/30"
                                )}
                            >
                                <div className={cn(
                                    "p-3 rounded-full",
                                    selectedFile ? "bg-green-500/10" : "bg-muted/50"
                                )}>
                                    <Share2 className={cn("h-6 w-6", selectedFile ? "text-green-500" : "text-muted-foreground")} />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-xs font-black uppercase tracking-tight">
                                        {selectedFile ? selectedFile.name : editingRoast ? "Resume Linked" : "Click to select PDF"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground font-medium">
                                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "Maximum file size: 5MB"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={!editingRoast && !selectedFile}
                            className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 font-black uppercase tracking-tight shadow-xl shadow-black/10 disabled:opacity-50"
                        >
                            {editingRoast ? "Update Submission" : "Start the Fire"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
