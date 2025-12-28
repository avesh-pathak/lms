import { getProblems } from "@/lib/problems"
import { LandingPage } from "@/components/landing-page"
import { toSlug } from "@/lib/utils"
import type { Topic } from "@/lib/types"

export default async function HomePage() {
  const problems = await getProblems()

  // Process problems into topics for the landing page showcase
  const topicMap = new Map<string, Topic>()
  problems.forEach(p => {
    const topicId = toSlug(p.topic)
    if (!topicMap.has(topicId)) {
      topicMap.set(topicId, {
        id: topicId,
        name: p.topic,
        solved: 0,
        total: 0
      })
    }
    const t = topicMap.get(topicId)!
    t.total++
    if (p.status === "Completed") t.solved++
  })

  const topics = Array.from(topicMap.values())

  return <LandingPage topics={topics} />
}
