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

export const getAllTheory = cache(async (): Promise<TopicTheory[]> => {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")

        // Fetch all documents from the collection
        const docs = await db.collection("topics_theory").find({}).toArray()

        let allTopics: TopicTheory[] = []

        for (const doc of docs) {
            if (doc.topics && Array.isArray(doc.topics)) {
                // It's a wrapper doc
                allTopics = [...allTopics, ...doc.topics.map((t: any) => ({
                    _id: (t._id || t.id || Math.random().toString()).toString(),
                    topicSlug: t.topicSlug,
                    name: t.name || "Unknown Topic",
                    category: t.category || doc.category || "DSA Patterns",
                    one_liner: t.one_liner || "",
                    core_concept: t.core_concept || "",
                    how_it_works: t.how_it_works || "",
                    visual_walkthrough: t.visual_walkthrough || "",
                    pattern_signals: t.pattern_signals || "",
                    complexity: t.complexity || "",
                }))]
            } else {
                // It's a single topic doc
                allTopics.push({
                    _id: (doc._id || doc.id).toString(),
                    topicSlug: doc.topicSlug,
                    name: doc.name || "Unknown Topic",
                    category: doc.category || "DSA Patterns",
                    one_liner: doc.one_liner || "",
                    core_concept: doc.core_concept || "",
                    how_it_works: doc.how_it_works || "",
                    visual_walkthrough: doc.visual_walkthrough || "",
                    pattern_signals: doc.pattern_signals || "",
                    complexity: doc.complexity || "",
                })
            }
        }

        return allTopics
    } catch (err) {
        console.error(`[Theory] Error fetching all theory:`, err)
        return []
    }
})

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
