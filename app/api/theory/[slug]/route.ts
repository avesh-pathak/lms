import { NextResponse } from "next/server"
import { getTopicTheory } from "@/lib/theory"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const theory = await getTopicTheory(slug)

    if (!theory) {
        return NextResponse.json({ error: "Theory not found" }, { status: 404 })
    }

    return NextResponse.json(theory)
}
