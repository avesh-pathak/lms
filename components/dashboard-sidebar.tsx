"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Menu,
  X,
  Cpu,
  Layers,
  MessageSquare,
  ShieldCheck,
  PencilRuler,
  Users,
  Trophy,
  Clock,
  Linkedin
} from "lucide-react"

import { ThemeToggle } from "./theme-toggle"
import { isSameDay, parseISO, subDays, format } from "date-fns"
import { Flame, Target, Medal } from "lucide-react"
import { useMemo } from "react"
import { useProblems } from "./problems-provider"
import { Progress } from "./ui/progress"
import { DailyGoal } from "./daily-goal"
import { ContinueLearning } from "./continue-learning"
import { SmartRecommendations } from "./smart-recommendations"
import { RevisionQueue } from "./revision-queue"
import { Separator } from "./ui/separator"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { topics, problems, loading } = useProblems()
  const [open, setOpen] = useState(false)

  // Calculate Today's Completion for DailyGoal
  const completedToday = useMemo(() => {
    const today = new Date()
    return problems.filter(p =>
      p.status === "Completed" &&
      p.completedAt &&
      isSameDay(parseISO(p.completedAt), today)
    ).length
  }, [problems])

  // Find Continue Learning Problem
  const mostRecentProblem = useMemo(() => {
    const sorted = [...problems]
      .filter(p => p.status !== "Completed" && (p.timeSpent || 0) > 0)
      .sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return dateB - dateA
      })
    return sorted[0] || null
  }, [problems])

  // Calculate Streak
  const streak = useMemo(() => {
    if (problems.length === 0) return 0
    const completedDates = problems
      .filter(p => p.status === "Completed" && p.completedAt)
      .map(p => format(parseISO(p.completedAt!), "yyyy-MM-dd"))
    const uniqueDates = Array.from(new Set(completedDates)).sort((a, b) => b.localeCompare(a))
    if (uniqueDates.length === 0) return 0
    let currentStreak = 0
    const today = format(new Date(), "yyyy-MM-dd")
    const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")
    let checkDate = uniqueDates[0] === today ? today : (uniqueDates[0] === yesterday ? yesterday : null)
    if (!checkDate) return 0
    let dateIterator = parseISO(checkDate)
    for (const dateStr of uniqueDates) {
      if (dateStr === format(dateIterator, "yyyy-MM-dd")) {
        currentStreak++
        dateIterator = subDays(dateIterator, 1)
      } else { break }
    }
    return currentStreak
  }, [problems])

  const stats = useMemo(() => {
    const solved = topics.reduce((acc, t) => acc + t.solved, 0)
    const total = topics.reduce((acc, t) => acc + t.total, 0)
    const mastered = topics.filter(t => t.solved === t.total && t.total > 0).length
    return { solved, total, mastered }
  }, [topics])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-md border bg-background/80 backdrop-blur-md p-2 shadow-lg hover:bg-background transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 top-0 left-0 h-screen w-80 border-r bg-card flex flex-col transition-transform",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-6 shrink-0 bg-background/50 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 rounded bg-[#FB923C] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base font-black uppercase tracking-tighter">Babua LMS</h1>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin">
          {/* Mentor Connect (Ethical Revenue Model) */}
          <div className="px-1">
            <button className="w-full group relative p-5 rounded-3xl bg-[#FB923C]/10 border border-[#FB923C]/20 hover:bg-[#FB923C]/20 transition-all overflow-hidden text-left">
              <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-12 w-12 text-[#FB923C]" />
              </div>
              <div className="relative space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]">Available Now</span>
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight">Office Hours</h4>
                <p className="text-[9px] font-bold text-muted-foreground leading-tight">Book a 1-on-1 session with a mentor for deep-dive help.</p>
              </div>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 px-1">
            <div className="bg-muted/30 p-3 rounded-2xl border border-border/50 flex flex-col items-center gap-1 group/stat relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
              <Flame className={cn("h-5 w-5 transition-transform group-hover/stat:scale-110", streak > 0 ? "text-orange-500 fill-orange-500" : "text-muted-foreground")} />
              <span className="text-sm font-black tracking-tight">{streak}</span>
              <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter">Streak</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-2xl border border-border/50 flex flex-col items-center gap-1 group/stat relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
              <Target className="h-5 w-5 text-primary transition-transform group-hover/stat:scale-110" />
              <span className="text-sm font-black tracking-tight">{stats.solved}</span>
              <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter">Solved</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-2xl border border-border/50 flex flex-col items-center gap-1 group/stat relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
              <Medal className="h-5 w-5 text-yellow-500 transition-transform group-hover/stat:scale-110" />
              <span className="text-sm font-black tracking-tight">{stats.mastered}</span>
              <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter">Mastered</span>
            </div>
          </div>

          <div className="px-1 space-y-4">
            <Link href="/dashboard/mentorship">
              <button className="w-full group relative p-5 rounded-3xl bg-[#FB923C]/10 border border-[#FB923C]/20 hover:bg-[#FB923C]/20 transition-all overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-12 w-12 text-[#FB923C]" />
                </div>
                <div className="relative space-y-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FB923C] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FB923C]">Office Hours</span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Mentorship</h4>
                  <p className="text-[9px] font-bold text-muted-foreground leading-tight">Book a 1-on-1 session with a mentor.</p>
                </div>
              </button>
            </Link>

            <Link href="/dashboard/proof-of-work">
              <button className="w-full group relative p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-12 w-12 text-indigo-500" />
                </div>
                <div className="relative space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Verified</span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight">Proof of Work</h4>
                  <p className="text-[9px] font-bold text-muted-foreground leading-tight">Your verified engineering record.</p>
                </div>
              </button>
            </Link>
          </div>

          {/* Domains Navigation */}
          <div className="space-y-3">
            <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-[0.2em] opacity-70">
              Engineering Domains
            </div>

            <div className="space-y-1">
              <NavLink
                href="/dashboard"
                icon={LayoutDashboard}
                active={pathname === "/dashboard"}
                onClick={() => setOpen(false)}
              >
                Overview
              </NavLink>
              <NavLink
                href="/dashboard/analytics"
                icon={BarChart3}
                active={pathname === "/dashboard/analytics"}
                onClick={() => setOpen(false)}
              >
                Analytics
              </NavLink>
              <NavLink
                href="/dashboard/hackathons"
                icon={Trophy}
                active={pathname === "/dashboard/hackathons"}
                onClick={() => setOpen(false)}
              >
                Hackathons
              </NavLink>
              <NavLink
                href="/dashboard/leaderboard"
                icon={Trophy}
                active={pathname === "/dashboard/leaderboard"}
                onClick={() => setOpen(false)}
              >
                Leaderboard
              </NavLink>
              <NavLink
                href="/dashboard/sessions"
                icon={Clock}
                active={pathname === "/dashboard/sessions"}
                onClick={() => setOpen(false)}
              >
                My Sessions
              </NavLink>
              <NavLink
                href="#"
                icon={Layers}
                active={false}
              >
                System Design
              </NavLink>
              <NavLink
                href="#"
                icon={PencilRuler}
                active={false}
              >
                Low Level Design
              </NavLink>
              <NavLink
                href="#"
                icon={Cpu}
                active={false}
              >
                Core Engineering
              </NavLink>
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Interesting Stuff */}
          <div className="space-y-4">
            <div className="text-[10px] font-black text-muted-foreground px-2 uppercase tracking-[0.2em] opacity-70">
              Solving Challenges
            </div>
            <DailyGoal completedToday={completedToday} />

            <div className="border rounded-2xl bg-card/40 border-dashed p-4 flex flex-col items-center text-center space-y-3 relative overflow-hidden group/challenge hover:border-primary/50 transition-all">
              <div className="p-3 rounded-full bg-primary/10 relative z-10">
                <Trophy className="h-6 w-6 text-primary group-hover/challenge:scale-110 transition-transform" />
              </div>
              <div className="space-y-1 relative z-10">
                <h4 className="text-xs font-black uppercase tracking-tight">Weekly Rush</h4>
                <p className="text-[10px] text-muted-foreground">Solve 15 problems this week</p>
              </div>
              <Progress value={Math.min((stats.solved / 15) * 100, 100)} className="h-1 w-full opacity-50" />
            </div>
          </div>

          {/* Pick Up */}
          <div className="space-y-4">
            <div className="text-[10px] font-black text-muted-foreground px-2 uppercase tracking-[0.2em] opacity-70">
              Continue Learning
            </div>
            <ContinueLearning problem={mostRecentProblem} />
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <div className="text-[10px] font-black text-muted-foreground px-2 uppercase tracking-[0.2em] opacity-70">
              Personalized for You
            </div>
            <SmartRecommendations />
          </div>

          {/* Revision */}
          <div className="space-y-4">
            <div className="text-[10px] font-black text-muted-foreground px-2 uppercase tracking-[0.2em] opacity-70">
              Revision Queue
            </div>
            <RevisionQueue />
          </div>

          {/* Topics Quick Access */}
          <div>
            <div className="text-[10px] font-black text-muted-foreground mb-3 px-2 uppercase tracking-[0.2em] opacity-70">
              Quick Access: DSA
            </div>

            <div className="space-y-1">
              {topics.slice(0, 5).map((topic) => (
                <NavLink
                  key={topic.id}
                  href={`/dashboard/topic/${topic.id}`}
                  icon={BookOpen}
                  active={pathname === `/dashboard/topic/${topic.id}`}
                  onClick={() => setOpen(false)}
                >
                  {topic.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 text-xs text-muted-foreground shrink-0 text-center font-bold uppercase tracking-tighter opacity-50">
          Babua Engineering LMS
        </div>
      </aside >
    </>
  )
}

function NavLink({
  href,
  icon: Icon,
  active,
  children,
  onClick,
}: {
  href: string
  icon: any
  active: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  )
}
