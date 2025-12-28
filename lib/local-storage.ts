// Session data management in localStorage

export interface SessionData {
  expandedProblems: Record<string, boolean>
  activeTimers: Record<string, { time: number; isRunning: boolean }>
  filters: {
    search: string
    difficulty: string[]
    status: string[]
  }
  lastVisitedTopic: string | null
  view: "overview" | "analytics"
  dailyGoal?: number
  bookedSessions: BookedSession[]
}

export interface BookedSession {
  id: string
  mentorId: string
  mentorName: string
  mentorImage: string
  mentorTitle: string
  mentorCompany: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  meetingLink?: string
}

const STORAGE_KEY = "dsa_dashboard_session"

export function getSessionData(): SessionData {
  if (typeof window === "undefined") {
    return getDefaultSessionData()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Error reading session data:", error)
  }

  return getDefaultSessionData()
}

export function saveSessionData(data: Partial<SessionData>) {
  if (typeof window === "undefined") return

  try {
    const current = getSessionData()
    const updated = { ...current, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("[v0] Error saving session data:", error)
  }
}

export function clearSessionData() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("[v0] Error clearing session data:", error)
  }
}

function getDefaultSessionData(): SessionData {
  return {
    expandedProblems: {},
    activeTimers: {},
    filters: {
      search: "",
      difficulty: [],
      status: [],
    },
    lastVisitedTopic: null,
    view: "overview",
    bookedSessions: []
  }
}

const PROBLEMS_STORAGE_KEY = "dsa_dashboard_problems"

export interface StoredProblemData {
  _id: string
  status?: "Pending" | "In Progress" | "Completed"
  starred?: boolean
  timeSpent?: number
  notes?: string
  solution?: string
  approach?: string
  tags?: string[]
  completedAt?: string
  updatedAt?: string
}

export function getProblemData(problemId: string): StoredProblemData | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(PROBLEMS_STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return data[problemId] || null
    }
  } catch (error) {
    console.error("[v0] Error reading problem data:", error)
  }

  return null
}

export function getAllProblemsData(): Record<string, StoredProblemData> {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(PROBLEMS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Error reading all problems data:", error)
  }

  return {}
}

export function updateProblemData(problemId: string, updates: Partial<StoredProblemData>) {
  if (typeof window === "undefined") return

  try {
    const allData = getAllProblemsData()
    const currentData = allData[problemId] || { _id: problemId }

    if (updates.status === "Completed" && currentData.status !== "Completed") {
      updates.completedAt = new Date().toISOString()
    } else if (updates.status && updates.status !== "Completed") {
      updates.completedAt = undefined
    }

    allData[problemId] = {
      ...currentData,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(PROBLEMS_STORAGE_KEY, JSON.stringify(allData))
  } catch (error) {
    console.error("[v0] Error updating problem data:", error)
  }
}

export function clearAllProblemsData() {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(PROBLEMS_STORAGE_KEY)
  } catch (error) {
    console.error("[v0] Error clearing problems data:", error)
  }
}
