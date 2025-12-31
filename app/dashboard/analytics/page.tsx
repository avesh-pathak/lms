import { Suspense } from "react"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsDashboard />
    </Suspense>
  )
}
