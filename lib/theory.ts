import { cache } from "react"
import clientPromise from "./mongodb"

export interface TopicTheory {
    _id: string
    topicSlug: string
    name: string
    category: string
    one_liner: string
    core_concept: string
    how_it_works: string
    visual_walkthrough: string
    pattern_signals: string
    complexity: string
}

export const getTopicTheory = cache(async (slug: string): Promise<TopicTheory | null> => {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")
        const searchSlug = slug.toLowerCase()

        console.log(`[Theory] Fetching for slug: ${slug} (normalized: ${searchSlug})`)

        // First, try finding as an individual document (case-insensitive)
        let theory = await db.collection("topics_theory").findOne({
            topicSlug: { $regex: new RegExp(`^${searchSlug}$`, 'i') }
        })

        // Fallback: Check if it's wrapped in a "topics" array (case-insensitive)
        if (!theory) {
            console.log(`[Theory] Not found as individual doc, checking wrapper...`)
            const wrapper = await db.collection("topics_theory").findOne({
                "topics.topicSlug": { $regex: new RegExp(`^${searchSlug}$`, 'i') }
            })

            if (wrapper && wrapper.topics) {
                console.log(`[Theory] Wrapper found with ${wrapper.topics.length} topics.`)
                theory = wrapper.topics.find((t: any) =>
                    t.topicSlug?.toLowerCase() === searchSlug ||
                    t.name?.toLowerCase() === searchSlug.replace(/-/g, ' ')
                )
            }
        }

        if (!theory) {
            console.log(`[Theory] No theory found for slug: ${slug}`)
            return null
        }

        console.log(`[Theory] Data found for: ${theory.name || theory.topicSlug}`)

        return {
            _id: (theory._id || theory.id || slug).toString(),
            topicSlug: theory.topicSlug || slug,
            name: theory.name || "Unknown Topic",
            category: theory.category || "DSA Patterns",
            one_liner: theory.one_liner || "",
            core_concept: theory.core_concept || "",
            how_it_works: theory.how_it_works || "",
            visual_walkthrough: theory.visual_walkthrough || "",
            pattern_signals: theory.pattern_signals || "",
            complexity: theory.complexity || "",
        }
    } catch (err) {
        console.error(`[Theory] Error fetching theory for ${slug}:`, err)
        return null
    }
})
