import { NextResponse } from "next/server"
import { getProblems } from "@/lib/problems"
import type { MongoDBProblem, Topic } from "@/lib/types"
import { toSlug } from "@/lib/utils"

export async function GET() {
  try {
    const problems = await getProblems()

    // ---------- derive topics ----------
    const topicMap = new Map<string, Topic>()

    for (const p of problems) {
      const id = toSlug(p.topic)

      if (!topicMap.has(id)) {
        topicMap.set(id, {
          id,
          name: p.topic,
          solved: 0,
          total: 0,
        })
      }

      const t = topicMap.get(id)!
      t.total += 1

      if (p.status === "Completed") {
        t.solved += 1
      }
    }

    const topics = Array.from(topicMap.values())

    return NextResponse.json({
      problems,
      topics,
    })
  } catch (err) {
    console.error("API /problems error:", err)
    return NextResponse.json(
      { error: "Failed to fetch problems" },
      { status: 500 }
    )
  }
}
