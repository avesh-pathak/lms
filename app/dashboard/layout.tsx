import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Breadcrumbs } from "@/components/breadcrumbs"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground flex-col lg:flex-row">
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 pt-0 lg:pt-0">
        <Breadcrumbs />
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
