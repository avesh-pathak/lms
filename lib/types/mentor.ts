export interface TimeSlot {
    id: string
    day: string // e.g., "Monday", "2024-10-24"
    startTime: string // "10:00 AM"
    endTime: string // "11:00 AM"
    isBooked: boolean
}

export interface Mentor {
    id: string
    name: string
    title: string
    company: string
    image: string
    bio: string
    expertise: string[]
    hourlyRate: number
    rating: number
    sessionsCompleted: number
    availability: TimeSlot[]
    languages: string[]
    education: string
    experience: string[]
    linkedinUrl?: string
    socials?: {
        linkedin?: string
        twitter?: string
        github?: string
    }
}

export type SessionType = "30min" | "60min" | "90min"
