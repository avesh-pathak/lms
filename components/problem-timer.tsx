"use client"

import { Button } from "@/components/ui/button"
import { Clock, Play, Pause, RotateCcw } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { getSessionData, saveSessionData } from "@/lib/local-storage"

type ProblemTimerProps = {
  problemId: string
  onTimeUpdate?: (problemId: string, time: number) => void
}

export function ProblemTimer({ problemId, onTimeUpdate }: ProblemTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const sessionData = getSessionData()
    const timerState = sessionData.activeTimers[problemId]
    if (timerState) {
      setTime(timerState.time)
      setIsRunning(timerState.isRunning)
    }
  }, [problemId])

  useEffect(() => {
    const sessionData = getSessionData()
    saveSessionData({
      activeTimers: {
        ...sessionData.activeTimers,
        [problemId]: { time, isRunning },
      },
    })
  }, [time, isRunning, problemId])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (time > 0 && onTimeUpdate) {
      onTimeUpdate(problemId, time)
    }
  }, [time, problemId, onTimeUpdate])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleToggle = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-sm font-mono min-w-[60px]">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className={isRunning ? "text-foreground" : "text-muted-foreground"}>{formatTime(time)}</span>
      </div>

      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleToggle}>
        {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </Button>

      {time > 0 && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
