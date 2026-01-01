"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

// Helper to convert slugs to titles
const slugToTitle = (slug: string) => {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

// Map specific segment names if needed
const routeConfig: Record<string, string> = {
    dashboard: "Overview",
    analytics: "Analytics",
    revision: "Revision Center",
    mentorship: "Mentorship",
    hackathons: "Hackathons",
    leaderboard: "Leaderboard",
    community: "Community",
    topic: "Topics",
}

export function Breadcrumbs() {
    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Don't show breadcrumbs on the home page, empty paths, or during SSR
    if (!mounted || pathname === "/" || !pathname) return null

    const segments = pathname.split("/").filter(Boolean)

    return (
        <Breadcrumb className="px-6 lg:px-8 py-4 bg-background/50 backdrop-blur-sm sticky top-0 z-30 border-b border-border/50">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/" className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {segments.map((segment, index) => {
                    const href = `/${segments.slice(0, index + 1).join("/")}`
                    const isLast = index === segments.length - 1
                    const title = routeConfig[segment] || slugToTitle(segment)

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{title}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
