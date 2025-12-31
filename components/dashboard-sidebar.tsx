"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
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
  Linkedin,
  Flame,
  Repeat
} from "lucide-react"

import { ThemeToggle } from "./theme-toggle"
import { Target, Medal } from "lucide-react"
import { useMemo } from "react"
import { useProblems } from "./problems-provider"
import { Separator } from "./ui/separator"

export function DashboardSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { topics, problems, loading } = useProblems()
  const [open, setOpen] = useState(false)

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
          {/* Domains Navigation */}
          <div className="space-y-3">
            <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70">
              Navigation
            </div>

            <div className="space-y-1">
              <NavLink
                href="/dashboard"
                icon={LayoutDashboard}
                active={pathname === "/dashboard" && !searchParams.get("domain")}
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
                href="/dashboard/revision"
                icon={Repeat}
                active={pathname === "/dashboard/revision"}
                onClick={() => setOpen(false)}
              >
                Revision Center
              </NavLink>
              <NavLink
                href="/dashboard/mentorship"
                icon={MessageSquare}
                active={pathname === "/dashboard/mentorship"}
                onClick={() => setOpen(false)}
              >
                Mentorship
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
            </div>
          </div>

          {/* Engineering Paths */}
          <div className="space-y-3">
            <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70">
              Engineering Paths
            </div>
            <div className="space-y-1">
              <NavLink
                href="/dashboard?domain=DSA"
                icon={Layers}
                active={pathname === "/dashboard" && (searchParams.get("domain") === "DSA" || !searchParams.get("domain"))}
                onClick={() => setOpen(false)}
              >
                DSA Patterns
              </NavLink>
              <NavLink
                href="/dashboard?domain=Core Engineering"
                icon={Cpu}
                active={pathname === "/dashboard" && ["Core Engineering", "System Design", "LLD", "AI/ML"].includes(searchParams.get("domain") || "")}
                onClick={() => setOpen(false)}
              >
                Core Engineering
              </NavLink>
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-3">
            <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70">
              Community Hub
            </div>
            <div className="space-y-1">
              <NavLink
                href="/dashboard/community"
                icon={Users}
                active={pathname.includes("/dashboard/community") || pathname === "/dashboard/roast"}
                onClick={() => setOpen(false)}
              >
                Community Hub
              </NavLink>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 text-[10px] text-muted-foreground shrink-0 text-center font-black uppercase tracking-[0.2em] opacity-30 italic">
          Babua Hub Verified Registry.
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
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary/10 text-primary font-black shadow-sm"
          : "text-foreground/80 hover:bg-muted hover:text-foreground font-bold"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-foreground/60")} />
      {children}
    </Link>
  )
}
