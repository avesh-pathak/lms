import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")
        const topics = await db.collection("quiz").find({}).toArray()

        return NextResponse.json({ topics })
    } catch (err) {
        console.error("API /quiz error:", err)
        return NextResponse.json(
            { error: "Failed to fetch quiz data" },
            { status: 500 }
        )
    }
}
