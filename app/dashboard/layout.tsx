import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProblemsProvider } from "@/components/problems-provider"
import { getProblems } from "@/lib/problems"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
