import { cache } from "react"
import clientPromise from "./mongodb"
import type { MongoDBProblem } from "./types"

export const getProblems = cache(async () => {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")

        const docs = await db.collection("problems").find({}, {
            projection: {
                _id: 1,
                title: 1,
                problem_link: 1,
                topic: 1,
                difficulty: 1,
                status: 1,
                starred: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }).toArray()

        const problems: MongoDBProblem[] = docs.map((doc) => ({
            _id: doc._id.toString(),
            title: doc.title,
            problem_link: doc.problem_link,
            topic: doc.topic,
            difficulty: doc.difficulty,
            status: doc.status ?? "Pending",
            starred: doc.starred ?? false,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        }))

        return problems
    } catch (err) {
        console.error("Error fetching problems:", err)
        return []
    }
})
