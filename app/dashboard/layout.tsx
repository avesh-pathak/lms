import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Suspense fallback={null}>
        <DashboardSidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
