import { Suspense } from "react"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardOverview />
    </Suspense>
  )
}
