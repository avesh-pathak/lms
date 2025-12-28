import React from "react"
import { HackathonEvent } from "@/components/hackathon-event"
import { notFound } from "next/navigation"

const hackathonsData = [
    {
        id: "1",
        title: "The Sliding Window Sprint",
        description: "Build a high-performance analytics dashboard that processes streaming data using the Sliding Window pattern.",
        status: "active" as const,
        participants: 142,
        startDate: "Oct 24",
        endDate: "Oct 26",
        prize: "$500 + Babua Pro",
        pattern: "Sliding Window",
        difficulty: "Intermediate" as const,
        rules: [
            "Implementation must use the Sliding Window pattern effectively.",
            "Submissions must be open-source and hosted on GitHub.",
            "Must include a live demo link (Vercel, Netlify, etc.).",
            "Project must handle real-time or simulated data streams."
        ],
        requirements: [
            "GitHub Repository URL",
            "Functional Live Demo",
            "Technical Breakdown / README",
            "Loom Video (Optional but recommended)"
        ]
    },
    {
        id: "2",
        title: "System Design: Scalable Cache",
        description: "Design and implement a distributed caching layer with LRU eviction and Write-through policies.",
        status: "active" as const,
        participants: 89,
        startDate: "Oct 25",
        endDate: "Oct 27",
        prize: "Interview with Top VC",
        pattern: "Caching",
        difficulty: "Advanced" as const,
        rules: [
            "Must implement LRU and LFU eviction policies.",
            "Must demonstrate thread-safety and distributed consistency.",
            "Complexity must be handled gracefully."
        ],
        requirements: [
            "High-Level Design Diagram",
            "Implementation Codebase",
            "Benchmark Results"
        ]
    }
]

export default async function HackathonPage({ params }: { params: { id: string } }) {
    const hackathon = hackathonsData.find(h => h.id === params.id)

    if (!hackathon) {
        notFound()
    }

    return (
        <div className="p-4 md:p-8">
            <HackathonEvent {...hackathon} />
        </div>
    )
}
