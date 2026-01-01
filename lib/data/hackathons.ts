export interface Hackathon {
    id: string
    title: string
    description: string
    status: "active" | "upcoming" | "ended"
    participants: number
    startDate: string
    endDate: string
    prize: string
    pattern: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    progress?: number
}

export const MOCK_HACKATHONS: Hackathon[] = [
    {
        id: "1",
        title: "The Sliding Window Sprint",
        description: "Build a high-performance analytics dashboard that processes streaming data using the Sliding Window pattern.",
        status: "active",
        participants: 142,
        startDate: "Oct 24",
        endDate: "Oct 26",
        prize: "$500 + Babua Pro",
        pattern: "Sliding Window",
        difficulty: "Intermediate",
        progress: 65
    },
    {
        id: "2",
        title: "System Design: Scalable Cache",
        description: "Design and implement a distributed caching layer with LRU eviction and Write-through policies.",
        status: "active",
        participants: 89,
        startDate: "Oct 25",
        endDate: "Oct 27",
        prize: "Interview with Top VC",
        pattern: "Caching",
        difficulty: "Advanced",
        progress: 0
    },
    {
        id: "3",
        title: "LLD: Banking System",
        description: "Create a thread-safe banking system with support for transactions, audits, and interest calculations.",
        status: "upcoming",
        participants: 256,
        startDate: "Nov 01",
        endDate: "Nov 03",
        prize: "Engineering Kit",
        pattern: "Command Pattern",
        difficulty: "Beginner"
    },
    {
        id: "4",
        title: "AI Agent Builder",
        description: "Build an autonomous agent that can solve multi-step engineering tasks using LLM tool use.",
        status: "upcoming",
        participants: 512,
        startDate: "Nov 05",
        endDate: "Nov 10",
        prize: "$1000 API Credits",
        pattern: "ReAct Agents",
        difficulty: "Advanced"
    }
]

export interface LegendaryProject {
    id: string
    title: string
    builder: string
    avatar: string
    hackathonTitle: string
    techStack: string[]
    description: string
    mentorJustification: string
    videoThumbnail: string
    githubUrl: string
    demoUrl: string
}

export const MOCK_HALL_OF_FAME: LegendaryProject[] = [
    {
        id: "p1",
        title: "HyperStream Analytics",
        builder: "Alex.dev",
        avatar: "/assets/mentors/image.png",
        hackathonTitle: "Season 1: Sliding Window",
        techStack: ["Rust", "WebAssembly", "Go", "Docker"],
        description: "A real-time telemetry processor handling 10GB/s with zero-copy deserialization. Built for extreme low-latency environments.",
        mentorJustification: "Won for extreme optimization: Handled 1M requests/sec by bypassing the standard allocator and using custom memory pools.",
        videoThumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        githubUrl: "https://github.com/avesh-pathak/lms",
        demoUrl: "https://youtu.be/jnTatLqluGI?si=-8k8TC_zkRSuVdGR"
    },
    {
        id: "p2",
        title: "VizShift Engine",
        builder: "Sarah_B",
        avatar: "/assets/mentors/image1.png",
        hackathonTitle: "Season 2: Data Viz",
        techStack: ["TypeScript", "React", "Canvas", "Three.js"],
        description: "A high-fidelity visualization engine for mapping sliding window shifts over complex data structures in 3D space.",
        mentorJustification: "Exceptional UI/UX: Sarah managed to visualize complex algorithmic shifts without overwhelming the user, making it educational and beautiful.",
        videoThumbnail: "https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=800",
        githubUrl: "https://github.com/avesh-pathak/lms",
        demoUrl: "https://youtu.be/jnTatLqluGI?si=-8k8TC_zkRSuVdGR"
    }
]
