export interface RoastComment {
    id: string
    userName: string
    avatar: string
    content: string
    burnLevel: "Mild" | "Hot" | "Supernova"
    createdAt: string
}

export interface RoastSubmission {
    id: string
    title: string
    builder: string
    avatar: string
    resumeUrl: string
    burnCount: number
    roastCount: number
    status: "Fresh" | "On Fire" | "Burnt"
    fileName?: string
    comments: RoastComment[]
}

export const MOCK_ROASTS: RoastSubmission[] = [
    {
        id: "r1",
        title: "Frontend Architect Resume",
        builder: "DevKaran",
        avatar: "/assets/mentors/image.png",
        resumeUrl: "#",
        burnCount: 124,
        roastCount: 12,
        status: "On Fire",
        comments: [
            {
                id: "c1",
                userName: "SeniorRoaster",
                avatar: "/assets/mentors/image1.png",
                content: "Your 'Skills' section has 45 keywords. Are you an engineer or a dictionary?",
                burnLevel: "Hot",
                createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
            },
            {
                id: "c2",
                userName: "CleanCoder",
                avatar: "/assets/mentors/image.png",
                content: "Centering your header is the only thing centered about this career path.",
                burnLevel: "Supernova",
                createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
            }
        ]
    },
    {
        id: "r2",
        title: "Backend Specialist CV",
        builder: "RustLover",
        avatar: "/assets/mentors/image1.png",
        resumeUrl: "#",
        burnCount: 89,
        roastCount: 5,
        status: "Fresh",
        comments: [
            {
                id: "c3",
                userName: "PerfGeek",
                avatar: "/assets/mentors/image1.png",
                content: "10 years of experience but you still use white space for indentation? My eyes are leaking.",
                burnLevel: "Mild",
                createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
            }
        ]
    }
]
