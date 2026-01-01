"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Zap,
    ChevronRight,
    CheckCircle2,
    XCircle,
    ArrowLeft,
    ArrowRight,
    Trophy,
    Clock,
    RotateCcw,
    BookOpen,
    Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

type Question = {
    id: number
    question: string
    options: string[]
    correct: number
    explanation: string
}

type Topic = {
    name: string
    questions: Question[]
}

export default function QuizPage() {
    const [topics, setTopics] = useState<Topic[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [showResults, setShowResults] = useState(false)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [userAnswers, setUserAnswers] = useState<{ questionIndex: number, selected: number, isCorrect: boolean }[]>([])

    // Timer state
    const [timer, setTimer] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch("/api/quiz")
                const data = await res.json()
                if (data.topics) setTopics(data.topics)
            } catch (err) {
                console.error("Failed to load quiz", err)
            } finally {
                setLoading(false)
            }
        }
        fetchQuiz()
    }, [])

    useEffect(() => {
        if (selectedTopic && !showResults && !isAnswered) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) clearInterval(timerRef.current)
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [selectedTopic, showResults, isAnswered])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const shuffle = (array: any[]) => {
        const newArray = [...array]
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
        }
        return newArray
    }

    const startRandomGauntlet = () => {
        const allQuestions = topics.flatMap(t => t.questions)
        const shuffled = shuffle(allQuestions)
        setSelectedTopic({
            name: "ALL TOPICS (RANDOM)",
            questions: shuffled.slice(0, 20) // Select top 20 for a quick random session
        })
        setTimer(0)
        setUserAnswers([])
    }

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-black italic uppercase tracking-widest text-xs text-muted-foreground">Initializing Gauntlet Systems...</p>
            </div>
        )
    }

    // Topic Selection View
    if (!selectedTopic) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter text-primary">
                            Pattern <span className="text-foreground">Gauntlet</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-2xl text-lg">
                            Test your mastery of engineering patterns stored on the cloud. Select a domain to begin the execution sequence.
                        </p>
                    </div>
                    <Button
                        onClick={startRandomGauntlet}
                        className="group h-16 px-8 rounded-3xl bg-primary text-white font-black italic uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all"
                    >
                        <Zap className="mr-2 h-6 w-6 fill-current animate-pulse" />
                        Random Gauntlet
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topics.map((topic) => (
                        <Card
                            key={topic.name}
                            className="group relative overflow-hidden bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all cursor-pointer rounded-[32px] shadow-xl hover:shadow-primary/5"
                            onClick={() => {
                                setSelectedTopic(topic)
                                setTimer(0)
                                setUserAnswers([])
                            }}
                        >
                            <CardContent className="p-8 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Zap className="h-6 w-6 fill-current" />
                                    </div>
                                </div>
                                <div className="space-y-1 mt-6">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                                        {topic.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-medium truncate">Verify your {topic.name} patterns.</p>
                                </div>
                                <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    Initialize <ChevronRight className="h-3 w-3" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    const currentQuestion = selectedTopic.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / selectedTopic.questions.length) * 100

    const handleAnswer = (index: number) => {
        if (isAnswered) return
        setSelectedAnswer(index)
        setIsAnswered(true)

        const isCorrect = index === currentQuestion.correct
        if (isCorrect) {
            setScore(prev => prev + 1)
        }

        setUserAnswers(prev => [...prev, {
            questionIndex: currentQuestionIndex,
            selected: index,
            isCorrect
        }])

        // Clear any existing timeout
        if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)

        // Instant advance (unnoticeable delay for click feel)
        autoAdvanceTimeoutRef.current = setTimeout(() => {
            nextQuestion()
        }, 150)
    }

    const nextQuestion = () => {
        if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)

        if (currentQuestionIndex + 1 < selectedTopic.questions.length) {
            setCurrentQuestionIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setIsAnswered(false)
        } else {
            setShowResults(true)
        }
    }

    const resetQuiz = () => {
        if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)
        setSelectedTopic(null)
        setCurrentQuestionIndex(0)
        setScore(0)
        setShowResults(false)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setTimer(0)
        setUserAnswers([])
    }

    // Results View
    if (showResults) {
        const mastery = (score / selectedTopic.questions.length) * 100
        return (
            <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 overflow-y-auto">
                <Card className="rounded-[48px] border-none bg-card shadow-2xl overflow-hidden">
                    <CardContent className="p-8 lg:p-12 text-center space-y-10">
                        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                            <div className="relative z-10 h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/40">
                                <Trophy className="h-8 w-8" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl lg:text-5xl font-black italic uppercase tracking-tighter bg-blue-600 text-white px-6 py-2 inline-block skew-x-[-10deg]">MISSION DEBRIEFING</h2>
                            <div className="block pt-2">
                                <Badge variant="secondary" className="bg-blue-600 text-white font-black uppercase tracking-widest px-4 py-1 skew-x-[-10deg] italic text-[10px]">
                                    GAUNTLET: {selectedTopic.name}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:gap-6 py-4">
                            <div className="p-6 lg:p-8 rounded-[32px] bg-muted/30 border border-border/50 space-y-2 group hover:bg-muted/50 transition-colors">
                                <span className="bg-blue-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest skew-x-[-10deg] italic">SCORE</span>
                                <p className="text-3xl lg:text-5xl font-black italic text-blue-600">{score} / {selectedTopic.questions.length}</p>
                            </div>
                            <div className="p-6 lg:p-8 rounded-[32px] bg-muted/30 border border-border/50 space-y-2 group hover:bg-muted/50 transition-colors">
                                <span className="bg-blue-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest skew-x-[-10deg] italic">EFFICIENCY</span>
                                <p className="text-3xl lg:text-5xl font-black italic text-blue-600">{mastery.toFixed(0)}%</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs font-black uppercase italic tracking-widest">Total Time: {formatTime(timer)}</span>
                        </div>

                        {/* Detailed Review Section */}
                        <div className="text-left space-y-6 pt-8 border-t border-border/50">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Execution Review
                            </h3>
                            <div className="grid gap-4">
                                {userAnswers.map((ans, i) => {
                                    const q = selectedTopic.questions[ans.questionIndex]
                                    return (
                                        <div key={i} className={cn(
                                            "p-6 rounded-[24px] border-2 space-y-4",
                                            ans.isCorrect ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"
                                        )}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Question {i + 1}</span>
                                                    <h4 className="font-bold italic uppercase tracking-tighter text-sm">{q.question}</h4>
                                                </div>
                                                {ans.isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                                                <div className="p-3 rounded-xl bg-background/50">
                                                    <span className="text-[8px] font-black uppercase tracking-widest block opacity-40 mb-1">Your Vector</span>
                                                    <span className={ans.isCorrect ? "text-green-600" : "text-red-600"}>{q.options[ans.selected]}</span>
                                                </div>
                                                {!ans.isCorrect && (
                                                    <div className="p-3 rounded-xl bg-background/50">
                                                        <span className="text-[8px] font-black uppercase tracking-widest block opacity-40 mb-1">Correct Protocol</span>
                                                        <span className="text-green-600">{q.options[q.correct]}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-[11px] font-medium leading-relaxed italic opacity-70 border-t border-border/20 pt-3">
                                                {q.explanation}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button
                                onClick={resetQuiz}
                                size="lg"
                                className="w-full h-16 rounded-3xl font-black italic uppercase tracking-widest text-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <RotateCcw className="mr-3 h-6 w-6" /> BACK TO GAUSS
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Question View
    return (
        <div className="p-2 lg:p-4 max-w-2xl mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-4 lg:mt-8">
            <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" className="rounded-lg font-black italic uppercase tracking-widest text-[8px] h-7 px-2" onClick={() => setSelectedTopic(null)}>
                    <ArrowLeft className="mr-1 h-3 w-3" /> Abort Sequence
                </Button>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-2 py-1 bg-card rounded-lg border border-border/50">
                        <Clock className="h-3 w-3 text-primary animate-pulse" />
                        <span className="text-[10px] font-black italic tabular-nums">{formatTime(timer)}</span>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                            Exceedance: {currentQuestionIndex + 1} / {selectedTopic.questions.length}
                        </p>
                        <div className="w-20 lg:w-24 h-1 bg-muted rounded-full overflow-hidden border border-border/50">
                            <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(251,146,60,0.5)]" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-3 lg:space-y-4 pt-2">
                <div className="space-y-1">
                    <Badge className="bg-primary/10 text-primary border-primary/20 uppercase font-black italic tracking-widest px-2 py-0 text-[8px]">Question Protocol</Badge>
                    <h2 className="text-xl lg:text-2xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-sm">
                        {currentQuestion.question}
                    </h2>
                </div>

                <div className="grid gap-2 lg:gap-3 mt-2">
                    {currentQuestion.options.map((option, idx) => {
                        return (
                            <button
                                key={idx}
                                disabled={isAnswered}
                                onClick={() => handleAnswer(idx)}
                                className={cn(
                                    "relative w-full p-3 lg:p-4 text-left rounded-xl border-2 transition-all font-black group overflow-hidden border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 shadow-sm active:scale-[0.98]"
                                )}
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="uppercase italic tracking-tight text-sm">{option}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}


