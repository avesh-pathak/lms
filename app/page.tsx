import { getProblems } from "@/lib/problems"
import { LandingPage } from "@/components/landing-page"
import { toSlug } from "@/lib/utils"
import type { Topic } from "@/lib/types"

export default function HomePage() {
  return <LandingPage topics={[]} />
}
