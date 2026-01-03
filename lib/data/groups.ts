export interface Squad {
    id: string;
    name: string;
    mentorId: string;
    mentorName: string;
    mentorImage: string;
    mentorTitle: string;
    mentorCompany: string;
    category: "System Design" | "DSA" | "Frontend" | "Backend" | "AI/ML";
    description: string;
    manifesto: string[];
    monthlyPrice: number;
    memberCount: number;
    maxMembers: number;
    weeklySchedule: string[];
    nextSession: string;
    status: "active" | "starting-soon";
}

export const MOCK_SQUADS: Squad[] = [
    {
        id: "distributed-titans",
        name: "Distributed Titans",
        mentorId: "1",
        mentorName: "Vikram Singh",
        mentorImage: "/assets/mentors/image.png",
        mentorTitle: "Senior Staff Engineer",
        mentorCompany: "Google",
        category: "System Design",
        description: "Executing high-fidelity engineering protocols for ultra-scalable systems. Focused on direct architectural synchronization and mentor-led load simulations.",
        manifesto: [
            "Weekly LIVE Pattern Gauntlet: Real-Time Load Simulations",
            "Direct Architecture Reviews of your Project Nodes",
            "Personalized Mission Plans (Monthly Sync)",
            "Priority 'War Room' Support for System Blockers"
        ],
        monthlyPrice: 2499,
        memberCount: 12,
        maxMembers: 20,
        weeklySchedule: ["Saturdays @ 9:00 PM IST", "Tuesdays @ 8:00 PM IST (Office Hours)"],
        nextSession: "Saturday, Jan 03",
        status: "active"
    },
    {
        id: "frontend-architects",
        name: "Frontend Architects",
        mentorId: "2",
        mentorName: "Sarah Chen",
        mentorImage: "/assets/mentors/image2.png",
        mentorTitle: "Engineering Manager",
        mentorCompany: "Netflix",
        category: "Frontend",
        description: "Mastering high-fidelity UI protocols. Focused on performance-driven pattern recognition and professional code-quality transmissions.",
        manifesto: [
            "Weekly UI Gauntlet: Live Performance Profiling",
            "Mentor PR Reviews (Clean Code & Reusability)",
            "Advanced Design System Architecture Sync",
            "Direct Guidance on Portfolio/Product Terminals"
        ],
        monthlyPrice: 1999,
        memberCount: 8,
        maxMembers: 15,
        weeklySchedule: ["Sundays @ 10:00 AM IST"],
        nextSession: "Sunday, Jan 04",
        status: "starting-soon"
    },
    {
        id: "dsa-elites",
        name: "DSA Elites Coalition",
        mentorId: "4",
        mentorName: "Rahul Devi",
        mentorImage: "/assets/mentors/image.png",
        mentorTitle: "Backend Lead",
        mentorCompany: "Zerodha",
        category: "DSA",
        description: "Algorithmic pattern recognition under pressure. Utilizing the Live Gauntlet for elite interview synchronization.",
        manifesto: [
            "Daily LIVE Pattern Gauntlet: Hard Simulation Nodes",
            "High-Bandwidth Mock Technical Interviews",
            "Direct Debugging Support for Complex Patterns",
            "Temporal Sync: 7AM Daily Motivation Transmission"
        ],
        monthlyPrice: 1499,
        memberCount: 18,
        maxMembers: 25,
        weeklySchedule: ["Mon-Fri @ 7:00 AM IST"],
        nextSession: "Monday, Jan 05",
        status: "active"
    }
];
