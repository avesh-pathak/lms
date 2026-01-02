import { cache } from "react"
import clientPromise from "./mongodb"

export const getQuizTopics = cache(async () => {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")
        const topics = await db.collection("quiz").find({}).toArray()

        // Convert MongoDB _id to string for serialization
        return JSON.parse(JSON.stringify(topics))
    } catch (err) {
        console.error("Error fetching quiz topics:", err)
        return []
    }
})
