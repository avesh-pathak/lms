import { Mentor, TimeSlot } from "@/lib/types/mentor"

// Helper to generate availability for the next 7 days
const generateSlots = (startIndex: number): TimeSlot[] => {
    const slots: TimeSlot[] = []
    const today = new Date()

    // Generate slots for next 5 days
    for (let i = 1; i <= 5; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        // Use local date string components to match client-side date-fns format logic
        // This prevents timezone issues where toISOString() returns previous day
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`

        slots.push({
            id: `slot-${startIndex}-${i}-1`,
            day: dateStr,
            startTime: "10:00 AM",
            endTime: "11:00 AM",
            isBooked: false
        })

        slots.push({
            id: `slot-${startIndex}-${i}-2`,
            day: dateStr,
            startTime: "02:00 PM",
            endTime: "03:00 PM",
            isBooked: false
        })

        if (i % 2 === 0) { // Alternating extra slot
            slots.push({
                id: `slot-${startIndex}-${i}-3`,
                day: dateStr,
                startTime: "04:00 PM",
                endTime: "05:00 PM",
                isBooked: false
            })
        }
    }
    return slots
}

export const MOCK_MENTORS: Mentor[] = [
    {
        id: "1",
        name: "Vikram Singh",
        title: "Senior Staff Engineer",
        company: "Google",
        image: "/assets/mentors/image.png",
        bio: "Ex-Amazon. I help engineers master Distributed Systems and crack L5/L6 interviews. Focused on practical scalability patterns.",
        expertise: ["System Design", "Distributed Systems", "Career Growth"],
        hourlyRate: 399,
        rating: 5.0,
        sessionsCompleted: 142,
        languages: ["English", "Hindi"],
        education: "B.Tech, IIT Bombay",
        experience: ["Senior Staff Engineer @ Google (Current)", "Principal Engineer @ Amazon", "SDE II @ Flipkart"],
        linkedinUrl: "https://www.linkedin.com/in/avesh-pathak/",
        availability: generateSlots(1),
    },
    {
        id: "2",
        name: "Sarah Chen",
        title: "Engineering Manager",
        company: "Netflix",
        image: "/assets/mentors/image2.png",
        bio: "Leading frontend infrastructure teams. I can help you with React performance, architecture, and moving from IC to Management.",
        expertise: ["Frontend Architecture", "React", "Management"],
        hourlyRate: 399,
        rating: 4.9,
        sessionsCompleted: 89,
        languages: ["English"],
        education: "MS CS, Stanford University",
        experience: ["Engineering Manager @ Netflix", "Senior Frontend Engineer @ Uber", "UI Architect @ Airbnb"],
        linkedinUrl: "https://www.linkedin.com/in/avesh-pathak/",
        availability: generateSlots(2),
    },
    {
        id: "3",
        name: "Rahul Devi",
        title: "Backend Lead",
        company: "Zerodha",
        image: "/assets/mentors/image.png",
        bio: "Building high-frequency trading systems. Let's talk about database internals, low-level design, and optimizing for milliseconds.",
        expertise: ["Low Level Design", "Databases", "Golang"],
        hourlyRate: 399,
        rating: 4.8,
        sessionsCompleted: 56,
        languages: ["English", "Hindi"],
        education: "SDE Intern @ TechCorp",
        experience: ["Ex-Amazon", "Open Source Contributor"],
        linkedinUrl: "https://www.linkedin.com/in/avesh-pathak/",
        availability: generateSlots(3)
    },
    {
        id: "4",
        name: "Alex Johnson",
        title: "Founding Engineer",
        company: "YCombinator Startup",
        image: "/assets/mentors/image2.png",
        bio: "Full-stack generalist. I help beginners break into tech and build their first production-grade applications.",
        expertise: ["Full Stack", "Career Switch", "Next.js"],
        hourlyRate: 399,
        rating: 5.0,
        sessionsCompleted: 210,
        languages: ["English"],
        education: "B.Tech in Computer Science",
        experience: ["Leading frontend infrastructure teams", "React Core Contributor"],
        linkedinUrl: "https://www.linkedin.com/in/avesh-pathak/",
        availability: generateSlots(4)
    },
    {
        id: "5",
        name: "Priya Patel",
        title: "AI Researcher",
        company: "DeepMind",
        image: "/assets/mentors/image.png",
        bio: "Demystifying LLMs and Transformers. I can guide you through the math and practical implementation of modern AI.",
        expertise: ["AI/ML", "PyTorch", "Research"],
        hourlyRate: 399,
        rating: 5.0,
        sessionsCompleted: 34,
        languages: ["English", "Bengali"],
        education: "M.S. in Machine Learning",
        experience: ["Published 5+ papers in CVPR", "Former Researcher at OpenAI"],
        linkedinUrl: "https://www.linkedin.com/in/avesh-pathak/",
        availability: generateSlots(5)
    }
]
