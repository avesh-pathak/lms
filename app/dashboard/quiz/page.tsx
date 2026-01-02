import { QuizClient } from "@/components/quiz-client"
import { getQuizTopics } from "@/lib/quiz"

export const metadata = {
    title: "Pattern Gauntlet | Babua Hub",
    description: "Test your engineering mastery through the execution sequence.",
}

export default async function QuizPage() {
    // Fetch data on the server for instant delivery
    const topics = await getQuizTopics()

    return <QuizClient initialTopics={topics} />
}
