import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")
        const projects = await db.collection("projects").find({}).sort({ lastActivityDate: -1 }).toArray()
        return NextResponse.json(projects)
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")
        const project = await request.json()

        project.lastActivityDate = new Date()
        project.lastActivity = "Just now"
        project.createdAt = new Date()

        const result = await db.collection("projects").insertOne(project)
        return NextResponse.json({ ...project, _id: result.insertedId })
    } catch (err) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    try {
        const client = await clientPromise
        const db = client.db("dsa_tracker")
        const { id, ...updates } = await request.json()

        updates.lastActivityDate = new Date()
        updates.lastActivity = "Just now"

        await db.collection("projects").updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        )
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 })

        const client = await clientPromise
        const db = client.db("dsa_tracker")
        await db.collection("projects").deleteOne({ _id: new ObjectId(id) })
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
