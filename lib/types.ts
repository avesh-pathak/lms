// Represents one problem stored in MongoDB
export interface MongoDBProblem {
  _id: string
  id?: string

  title: string
  problem_link: string
  topic: string

  difficulty: "Easy" | "Medium" | "Hard"
  status: "Pending" | "In Progress" | "Completed"

  starred: boolean

  // timestamps
  createdAt: string
  updatedAt: string
  completedAt?: string // ✅ REQUIRED for analytics (streaks, weekly activity)

  // optional user data
  domain?: "DSA" | "System Design" | "LLD" | "Core Engineering" | "AI/ML"
  timeSpent?: number
  notes?: string
  solution?: string
  approach?: string
  tags?: string[]
  confidence?: number
  reviewDueAt?: string
  isReviewDue?: boolean
}

// Represents a topic summary used in dashboard & analytics
export type Topic = {
  id: string
  name: string
  solved: number
  total: number
  domain?: "DSA" | "System Design" | "LLD" | "Core Engineering" | "AI/ML"
  reviewCount?: number
}
