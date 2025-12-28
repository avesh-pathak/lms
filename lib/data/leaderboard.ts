export interface LeaderboardEntry {
    rank: number
    name: string
    avatar: string
    college: string
    points: number
    problemsSolved: number
    streak: number
    tier: "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze"
    isCurrentUser?: boolean
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    {
        rank: 1,
        name: "Abhishek Gupta",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishek",
        college: "IIT Delhi",
        points: 4250,
        problemsSolved: 142,
        streak: 15,
        tier: "Diamond"
    },
    {
        rank: 2,
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        college: "NSUT Delhi",
        points: 3980,
        problemsSolved: 128,
        streak: 22,
        tier: "Platinum"
    },
    {
        rank: 3,
        name: "Rahul Verma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        college: "DTU",
        points: 3720,
        problemsSolved: 115,
        streak: 8,
        tier: "Gold"
    },
    {
        rank: 4,
        name: "Sanya Malhotra",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya",
        college: "BITS Pilani",
        points: 3550,
        problemsSolved: 108,
        streak: 31,
        tier: "Gold"
    },
    {
        rank: 5,
        name: "Vikram Mehta",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        college: "NIT Trichy",
        points: 3410,
        problemsSolved: 95,
        streak: 12,
        tier: "Silver"
    },
    {
        rank: 6,
        name: "Ananya Iyer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
        college: "IIIT Hyderabad",
        points: 3200,
        problemsSolved: 88,
        streak: 5,
        tier: "Silver"
    },
    {
        rank: 7,
        name: "Arjun Reddy",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        college: "IIT Bombay",
        points: 3150,
        problemsSolved: 84,
        streak: 0,
        tier: "Bronze"
    },
    {
        rank: 8,
        name: "Ishita Das",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishita",
        college: "Jadavpur University",
        points: 2980,
        problemsSolved: 79,
        streak: 19,
        tier: "Silver"
    },
    {
        rank: 42,
        name: "Amit Patel (You)",
        avatar: "/assets/mentors/image.png",
        college: "SDE College",
        points: 1250,
        problemsSolved: 42,
        streak: 5,
        tier: "Bronze",
        isCurrentUser: true
    }
]
