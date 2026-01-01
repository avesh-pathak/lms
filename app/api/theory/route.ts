import { NextResponse } from "next/server"
import { getAllTheory } from "@/lib/theory"

export async function GET() {
    const theory = await getAllTheory()
    return NextResponse.json(theory)
}
