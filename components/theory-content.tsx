"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import { TopicTheory } from "@/lib/theory"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, BookOpen, Search, Layers, Zap, Code, Video } from "lucide-react"

export function TheoryContent({ theory, onPracticeClick }: { theory: TopicTheory, onPracticeClick?: () => void }) {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="space-y-4">
                <Badge variant="outline" className="px-3 py-1 text-primary border-primary/20 bg-primary/5 font-black tracking-wider uppercase text-[10px]">
                    {theory.category}
                </Badge>
                <div className="space-y-2">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-foreground">
                        {theory.name}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium italic border-l-4 border-primary/30 pl-4 leading-relaxed max-w-3xl">
                        "{theory.one_liner}"
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-12">
                    {/* Core Concept */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <BookOpen className="h-5 w-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Core Concept</h3>
                        </div>
                        <div className="text-lg leading-relaxed text-foreground/90 font-medium">
                            <ReactMarkdown>{theory.core_concept}</ReactMarkdown>
                        </div>
                    </section>

                    {/* Video Briefing */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Video className="h-5 w-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Visual Analysis</h3>
                        </div>
                        <div className="aspect-video rounded-[3rem] overflow-hidden border-8 border-primary/5 shadow-2xl bg-black group relative">
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/zvK49innOZY"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="relative z-0"
                            ></iframe>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 italic text-center">
                            Pattern Briefing: High-bandwidth visual breakdown of this engineering protocol.
                        </p>
                    </section>

                    {/* How it Works */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-primary">
                            <Layers className="h-5 w-5" />
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Implementation Steps</h3>
                        </div>
                        <div className="prose prose-invert max-w-none text-muted-foreground bg-muted/40 p-8 rounded-[2rem] border border-border/50 shadow-inner">
                            <div className="space-y-2 prose-strong:text-foreground prose-strong:font-black prose-p:leading-relaxed">
                                <ReactMarkdown>
                                    {theory.how_it_works}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </section>

                    {/* Visual Walkthrough */}
                    {theory.visual_walkthrough && (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Code className="h-5 w-5" />
                                <h3 className="text-sm font-black uppercase tracking-widest italic">Visual Walkthrough</h3>
                            </div>
                            <div className="rounded-3xl overflow-hidden border border-primary/10 bg-black/60 backdrop-blur-md shadow-2xl">
                                <div className="bg-muted/30 px-5 py-3 border-b border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Trace Log / Debugger</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter opacity-50">ASCII-VIZ</Badge>
                                </div>
                                <div className="p-8 overflow-x-auto font-mono text-sm leading-relaxed text-primary/80 selection:bg-primary/20">
                                    <ReactMarkdown
                                        components={{
                                            code: ({ children }: { children?: React.ReactNode }) => <span className="text-primary font-bold">{children}</span>,
                                            pre: ({ children }: { children?: React.ReactNode }) => <pre className="bg-transparent p-0 m-0 whitespace-pre">{children}</pre>
                                        }}
                                    >
                                        {theory.visual_walkthrough}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Ready to Practice */}
                    <div className="pt-8 border-t border-border/50">
                        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="space-y-1 text-center md:text-left">
                                <h4 className="text-xl font-black uppercase italic tracking-tighter">Ready to conquer?</h4>
                                <p className="text-sm text-muted-foreground font-medium">Put this theory to the test with our curated problems.</p>
                            </div>
                            <Button
                                size="lg"
                                className="rounded-xl font-black uppercase italic tracking-wider h-12 px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                onClick={onPracticeClick}
                            >
                                <Zap className="mr-2 h-4 w-4 fill-current" />
                                Start Practicing
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">

                    {/* Pattern Signals */}
                    <Card className="rounded-[2rem] border-primary/10 shadow-2xl overflow-hidden bg-card/40 backdrop-blur-md">
                        <div className="p-8 space-y-5">
                            <div className="flex items-center gap-2 text-primary">
                                <Search className="h-5 w-5" />
                                <h3 className="text-sm font-black uppercase tracking-widest italic">Interview Signals</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="text-sm font-medium leading-relaxed text-muted-foreground prose-ul:list-none prose-ul:p-0 prose-li:mb-3 prose-li:flex prose-li:items-start prose-li:before:content-['⚡'] prose-li:before:mr-3 prose-li:before:text-primary">
                                    <ReactMarkdown>
                                        {theory.pattern_signals}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Complexity */}
                    <Card className="rounded-[2rem] border-primary/20 shadow-2xl overflow-hidden bg-primary/[0.03] relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="p-8 space-y-5 relative z-10">
                            <div className="flex items-center gap-2 text-primary text-xl">
                                <Zap className="h-6 w-6 fill-current" />
                                <h3 className="text-sm font-black uppercase tracking-widest italic">Efficiency</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-base font-bold tracking-tight text-foreground/90 prose-p:m-0 prose-strong:text-primary prose-strong:text-lg">
                                    <ReactMarkdown>
                                        {theory.complexity}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
