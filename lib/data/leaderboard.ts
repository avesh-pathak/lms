export interface LeaderboardEntry {
    rank: number
    name: string
    avatar: string
    college: string
    points: number
    problemsSolved: number
    weeklyPoints: number
    weeklySolved: number
    streak: number
    tier: "Diamond" | "Platinum" | "Gold" | "Silver" | "Bronze"
    isCurrentUser?: boolean
    isFriend?: boolean
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    {
        rank: 1,
        name: "Abhishek Gupta",
        avatar: "/assets/mentors/image.png",
        college: "IIT Delhi",
        points: 4250,
        problemsSolved: 142,
        weeklyPoints: 450,
        weeklySolved: 12,
        streak: 15,
        tier: "Diamond"
    },
    {
        rank: 2,
        name: "Priya Sharma",
        avatar: "/assets/mentors/image2.png",
        college: "NSUT Delhi",
        points: 3980,
        problemsSolved: 128,
        weeklyPoints: 320,
        weeklySolved: 8,
        streak: 22,
        tier: "Platinum",
        isFriend: true
    },
    {
        rank: 3,
        name: "Rahul Verma",
        avatar: "/assets/mentors/image.png",
        points: 3720,
        problemsSolved: 115,
        weeklyPoints: 280,
        weeklySolved: 7,
        streak: 8,
        tier: "Gold",
        college: "IIT Kanpur"
    },
    {
        rank: 4,
        name: "Sanya Malhotra",
        avatar: "/assets/mentors/image2.png",
        college: "BITS Pilani",
        points: 3550,
        problemsSolved: 108,
        weeklyPoints: 500,
        weeklySolved: 14,
        streak: 31,
        tier: "Gold"
    },
    {
        rank: 5,
        name: "Vikram Mehta",
        avatar: "/assets/mentors/image.png",
        college: "NIT Trichy",
        points: 3410,
        problemsSolved: 95,
        weeklyPoints: 150,
        weeklySolved: 4,
        streak: 12,
        tier: "Silver",
        isFriend: true
    },
    {
        rank: 6,
        name: "Ananya Iyer",
        avatar: "/assets/mentors/image2.png",
        college: "IIIT Hyderabad",
        points: 3200,
        problemsSolved: 88,
        weeklyPoints: 410,
        weeklySolved: 10,
        streak: 5,
        tier: "Silver"
    },
    {
        rank: 7,
        name: "Arjun Reddy",
        avatar: "/assets/mentors/image.png",
        college: "IIT Bombay",
        points: 3150,
        problemsSolved: 84,
        weeklyPoints: 100,
        weeklySolved: 3,
        streak: 0,
        tier: "Bronze"
    },
    {
        rank: 8,
        name: "Ishita Das",
        avatar: "/assets/mentors/image2.png",
        college: "Jadavpur University",
        points: 2980,
        problemsSolved: 79,
        weeklyPoints: 200,
        weeklySolved: 5,
        streak: 19,
        tier: "Silver"
    },
    {
        rank: 42,
        name: "Amit Patel",
        avatar: "/assets/mentors/image.png",
        college: "IIT Bombay",
        points: 1250,
        problemsSolved: 42,
        weeklyPoints: 250,
        weeklySolved: 6,
        streak: 5,
        tier: "Bronze",
        isCurrentUser: true
    }
]
