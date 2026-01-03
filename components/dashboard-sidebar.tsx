"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import React, { useState } from "react"
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
  Repeat,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  Wifi,
  Signal
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
  const [isCollapsed, setIsCollapsed] = useState(false)

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
        className="lg:hidden fixed top-3 left-4 z-50 rounded-xl border bg-background/80 backdrop-blur-md p-2.5 shadow-xl hover:bg-background transition-all active:scale-95 border-border/50"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5 text-primary" aria-hidden="true" />
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
          "fixed z-50 top-0 left-0 h-screen border-r bg-card flex flex-col transition-all duration-300 ease-in-out overflow-y-auto scrollbar-hide",
          isCollapsed ? "w-[80px]" : "w-[320px]",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b px-6 shrink-0 bg-background/50 backdrop-blur-sm transition-all",
          isCollapsed ? "justify-center px-0 text-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 rounded bg-[#FB923C] flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-base font-black uppercase tracking-tighter">Babua LMS</h1>
            </Link>
          )}
          <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "gap-1")}>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 hover:bg-muted rounded-lg transition-colors hidden lg:block text-[#FB923C]"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden="true" /> : <PanelLeftClose className="h-5 w-5" aria-hidden="true" />}
            </button>
            {!isCollapsed && <ThemeToggle />}
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden ml-2"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" aria-hidden="true" />
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
                isCollapsed={isCollapsed}
              >
                Overview
              </NavLink>
              <NavLink
                href="/dashboard/analytics"
                icon={BarChart3}
                active={pathname === "/dashboard/analytics"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Analytics
              </NavLink>
              <NavLink
                href="/dashboard/revision"
                icon={Repeat}
                active={pathname === "/dashboard/revision"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Revision Center
              </NavLink>
              <NavLink
                href="/dashboard/mentorship"
                icon={MessageSquare}
                active={pathname === "/dashboard/mentorship"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Mentorship
              </NavLink>
              <NavLink
                href="/dashboard/groups"
                icon={Users}
                active={pathname === "/dashboard/groups"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Squads
              </NavLink>
              <NavLink
                href="/dashboard/hackathons"
                icon={Trophy}
                active={pathname === "/dashboard/hackathons"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Hackathons
              </NavLink>
              <NavLink
                href="/dashboard/leaderboard"
                icon={Trophy}
                active={pathname === "/dashboard/leaderboard"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Leaderboard
              </NavLink>
              <NavLink
                href="/dashboard/quiz"
                icon={BookOpen}
                active={pathname === "/dashboard/quiz"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Quiz
              </NavLink>
            </div>
          </div>

          {/* Engineering Paths */}
          <div className="space-y-3">
            {!isCollapsed && (
              <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70">
                Engineering Paths
              </div>
            )}
            <div className="space-y-1">
              <NavLink
                href="/dashboard?domain=DSA"
                icon={Layers}
                active={pathname === "/dashboard" && searchParams.get("domain") === "DSA"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                DSA Patterns
              </NavLink>
              <NavLink
                href="/dashboard?domain=Core Engineering"
                icon={Cpu}
                active={pathname === "/dashboard" && ["Core Engineering", "System Design", "LLD", "AI/ML"].includes(searchParams.get("domain") || "")}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
              >
                Core Engineering
              </NavLink>
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-3">
            {!isCollapsed && (
              <div className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-widest opacity-70">
                Community Hub
              </div>
            )}
            <div className="space-y-1">
              <NavLink
                href="/dashboard/community"
                icon={Users}
                active={pathname.includes("/dashboard/community") || pathname === "/dashboard/roast"}
                onClick={() => setOpen(false)}
                isCollapsed={isCollapsed}
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

const NavLink = React.memo(function NavLink({
  href,
  icon: Icon,
  active,
  children,
  onClick,
  isCollapsed,
}: {
  href: string
  icon: any
  active: boolean
  children: React.ReactNode
  onClick?: () => void
  isCollapsed?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={isCollapsed ? (typeof children === 'string' ? children : '') : ''}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-primary/10 text-primary font-black shadow-sm"
          : "text-foreground/80 hover:bg-muted hover:text-foreground font-bold",
        isCollapsed ? "justify-center px-0 h-12 w-12 mx-auto" : ""
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-foreground/60")} aria-hidden="true" />
      {!isCollapsed && children}
    </Link>
  )
})
