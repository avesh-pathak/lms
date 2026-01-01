"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {
    Plus,
    Github,
    ExternalLink,
    Code2,
    Layers,
    Cpu,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Loader2,
    Trash2,
    PlusCircle,
    X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Project = {
    _id?: string
    title: string
    description: string
    techStack: string[]
    status: 'In Progress' | 'Completed' | 'Research'
    progress: number
    githubUrl?: string
    liveUrl?: string
    lastActivity: string
    milestones: { title: string; completed: boolean }[]
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // New Project Form State
    const [newProject, setNewProject] = useState<Partial<Project>>({
        title: "",
        description: "",
        techStack: [],
        status: "In Progress",
        progress: 0,
        milestones: []
    })
    const [techInput, setTechInput] = useState("")
    const [milestoneInput, setMilestoneInput] = useState("")

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects")
            const data = await res.json()
            setProjects(Array.isArray(data) ? data : [])
        } catch (err) {
            toast.error("Cloud registry connection failed")
        } finally {
            setLoading(false)
        }
    }

    const handleCreateProject = async () => {
        if (!newProject.title) return toast.error("Project identity required")
        setIsSaving(true)
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProject)
            })
            if (res.ok) {
                toast.success("Build mission initialized")
                setIsDialogOpen(false)
                fetchProjects()
                setNewProject({ title: "", description: "", techStack: [], status: "In Progress", progress: 0, milestones: [] })
            }
        } catch (err) {
            toast.error("Build initialization failed")
        } finally {
            setIsSaving(false)
        }
    }

    const toggleMilestone = async (project: Project, mIdx: number) => {
        const updatedMilestones = [...project.milestones]
        updatedMilestones[mIdx].completed = !updatedMilestones[mIdx].completed

        // Auto-calculate progress
        const completedCount = updatedMilestones.filter(m => m.completed).length
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100)

        try {
            await fetch("/api/projects", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: project._id,
                    milestones: updatedMilestones,
                    progress: updatedMilestones.length > 0 ? newProgress : project.progress,
                    status: newProgress === 100 ? "Completed" : project.status
                })
            })
            fetchProjects()
        } catch (err) {
            toast.error("Milestone update failed")
        }
    }

    const addTech = () => {
        if (techInput && !newProject.techStack?.includes(techInput)) {
            setNewProject(prev => ({ ...prev, techStack: [...(prev.techStack || []), techInput] }))
            setTechInput("")
        }
    }

    const addMilestone = () => {
        if (milestoneInput) {
            setNewProject(prev => ({
                ...prev,
                milestones: [...(prev.milestones || []), { title: milestoneInput, completed: false }]
            }))
            setMilestoneInput("")
        }
    }

    const deleteProject = async (id: string) => {
        if (!confirm("Terminate mission? This action is irreversible.")) return
        try {
            await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
            fetchProjects()
            toast.success("Mission terminated")
        } catch (err) {
            toast.error("Decommissioning failed")
        }
    }

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter text-primary">
                        Proof of <span className="text-foreground">Work</span>
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-2xl text-lg text-balance">
                        Execute your vision. Track your architectural milestones and showcase your high-signal builds to the registry.
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black italic uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all">
                            <Plus className="mr-2 h-6 w-6" /> Initialize Build
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-card border-border/50 rounded-[32px] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-primary">Mission Prototype</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1 scrollbar-hide">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Identity</label>
                                <Input
                                    placeholder="Project Name"
                                    className="bg-muted/50 border-border/50 h-12 rounded-xl"
                                    value={newProject.title}
                                    onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Overview</label>
                                <Textarea
                                    placeholder="Mission description..."
                                    className="bg-muted/50 border-border/50 min-h-[100px] rounded-xl"
                                    value={newProject.description}
                                    onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Engine Stack</label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Go, Rust, etc."
                                            className="bg-muted/50 border-border/50 h-10 rounded-xl"
                                            value={techInput}
                                            onChange={e => setTechInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addTech()}
                                        />
                                        <Button onClick={addTech} size="icon" variant="outline" className="rounded-xl"><PlusCircle className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {newProject.techStack?.map(t => (
                                            <Badge key={t} variant="secondary" className="px-2 py-0 h-6 text-[8px] font-black uppercase tracking-widest italic group">
                                                {t}
                                                <X className="ml-1 h-3 w-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => setNewProject(prev => ({ ...prev, techStack: prev.techStack?.filter(x => x !== t) }))} />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Architectural Milestones</label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Milestone title..."
                                            className="bg-muted/50 border-border/50 h-10 rounded-xl"
                                            value={milestoneInput}
                                            onChange={e => setMilestoneInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addMilestone()}
                                        />
                                        <Button onClick={addMilestone} size="icon" variant="outline" className="rounded-xl"><PlusCircle className="h-4 w-4" /></Button>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        {newProject.milestones?.map((m, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/50 text-[10px] font-medium italic">
                                                <span>{m.title}</span>
                                                <X className="h-3 w-3 cursor-pointer opacity-50 hover:opacity-100" onClick={() => setNewProject(prev => ({ ...prev, milestones: prev.milestones?.filter((_, idx) => idx !== i) }))} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Operational Vectors (URLs)</label>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="GitHub URL"
                                        className="bg-muted/50 border-border/50 h-10 rounded-xl"
                                        value={newProject.githubUrl}
                                        onChange={e => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                                    />
                                    <Input
                                        placeholder="Operational URL"
                                        className="bg-muted/50 border-border/50 h-10 rounded-xl"
                                        value={newProject.liveUrl}
                                        onChange={e => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-6">
                            <Button
                                onClick={handleCreateProject}
                                disabled={isSaving}
                                className="w-full h-14 bg-primary text-white font-black italic uppercase tracking-widest text-lg rounded-2xl"
                            >
                                {isSaving ? <Loader2 className="animate-spin h-6 w-6" /> : "Initialize Mission"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="font-black italic uppercase tracking-widest text-[10px] opacity-50">Syncing architectural registry...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-border/50 rounded-[48px] bg-muted/5">
                    <div className="h-20 w-20 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
                        <Code2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Ready for a new prototype?</h3>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto text-sm mb-8">
                        Your architecture registry is waiting for the next high-performance build. Initialize a new mission today.
                    </p>
                </div>
            ) : (
                <>
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Active Missions", value: projects.filter(p => p.status === 'In Progress').length, icon: Cpu, color: "text-blue-500" },
                            { label: "Completed Prototypes", value: projects.filter(p => p.status === 'Completed').length, icon: CheckCircle2, color: "text-green-500" },
                            { label: "Architecture Score", value: projects.reduce((acc, p) => acc + (p.progress * 10), 0).toLocaleString(), icon: Layers, color: "text-orange-500" }
                        ].map((stat, i) => (
                            <Card key={i} className="bg-card/30 backdrop-blur-xl border-border/50 rounded-[28px] overflow-hidden group hover:border-primary/30 transition-all">
                                <CardContent className="p-6 flex items-center gap-5">
                                    <div className={cn("h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{stat.label}</p>
                                        <p className="text-3xl font-black italic uppercase tracking-tighter">{stat.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Project Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <Card key={project._id} className="relative group bg-card/40 backdrop-blur-2xl border-border/50 rounded-[40px] overflow-hidden hover:border-primary/40 transition-all shadow-xl shadow-black/5">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={cn(
                                                    "uppercase font-black italic tracking-widest px-2 py-0.5 text-[8px] rounded-lg border-none shadow-sm",
                                                    project.status === 'In Progress' ? "bg-blue-600 text-white" :
                                                        project.status === 'Completed' ? "bg-green-600 text-white" :
                                                            "bg-orange-600 text-white"
                                                )}>
                                                    {project.status}
                                                </Badge>
                                                <div className="h-1 w-1 rounded-full bg-border" />
                                                <div className="flex items-center gap-1 text-muted-foreground text-[8px] font-black uppercase tracking-widest">
                                                    <Calendar className="h-3 w-3" />
                                                    Activity: {project.lastActivity}
                                                </div>
                                            </div>
                                            <CardTitle className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">
                                                {project.title}
                                            </CardTitle>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full h-10 w-10 hover:bg-red-500/10 hover:text-red-500 text-muted-foreground"
                                            onClick={() => project._id && deleteProject(project._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardDescription className="text-sm font-medium leading-relaxed italic line-clamp-2 mt-4 text-foreground/70">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-8 pt-4 space-y-8">
                                    {/* Tech Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map(tech => (
                                            <span key={tech} className="px-3 py-1 rounded-xl bg-muted/40 border border-border/40 text-[9px] font-black uppercase tracking-widest italic text-muted-foreground">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Progress & Milestones */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Execution Progress</p>
                                            <p className="text-lg font-black italic text-primary">{project.progress}%</p>
                                        </div>
                                        <div className="h-3 bg-muted/50 rounded-full border border-border/50 overflow-hidden p-0.5">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(251,146,60,0.3)]"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            {project.milestones.map((ms, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => toggleMilestone(project, idx)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-2xl border transition-all truncate text-left",
                                                        ms.completed ? "border-green-500/20 bg-green-500/5 text-green-500/80" : "border-border/50 bg-muted/20 text-muted-foreground hover:border-primary/30"
                                                    )}
                                                >
                                                    {ms.completed ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <div className="h-4 w-4 rounded-full border-2 border-dashed border-current shrink-0" />}
                                                    <span className="text-[10px] font-black uppercase tracking-widest truncate">{ms.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4">
                                        {project.githubUrl && (
                                            <Button
                                                variant="outline"
                                                className="flex-1 h-12 rounded-2xl border-border/50 bg-background/50 hover:bg-muted font-black italic uppercase tracking-widest text-xs"
                                                onClick={() => window.open(project.githubUrl, '_blank')}
                                            >
                                                <Github className="mr-2 h-4 w-4" /> Source code
                                            </Button>
                                        )}
                                        {project.liveUrl ? (
                                            <Button
                                                className="flex-1 h-12 rounded-2xl bg-primary text-white font-black italic uppercase tracking-widest text-xs hover:scale-[1.02] shadow-lg shadow-primary/10"
                                                onClick={() => window.open(project.liveUrl, '_blank')}
                                            >
                                                <ExternalLink className="mr-2 h-4 w-4" /> Operational Link
                                            </Button>
                                        ) : (
                                            <Button variant="outline" className="flex-1 h-12 rounded-2xl border-border/50 bg-background/50 hover:bg-muted font-black italic uppercase tracking-widest text-xs">
                                                View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
