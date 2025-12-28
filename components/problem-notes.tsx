"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { StickyNote, Code2, Lightbulb, Save } from "lucide-react"
import { useState, useEffect } from "react"

type ProblemNotesProps = {
  problemId: string
  initialNotes?: string
  initialSolution?: string
  initialApproach?: string
  onSave?: (problemId: string, data: { notes: string; solution: string; approach: string }) => void
}

export function ProblemNotes({
  problemId,
  initialNotes = "",
  initialSolution = "",
  initialApproach = "",
  onSave,
}: ProblemNotesProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [solution, setSolution] = useState(initialSolution)
  const [approach, setApproach] = useState(initialApproach)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const storageKey = `problem_notes_${problemId}`
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setNotes(data.notes || initialNotes)
        setSolution(data.solution || initialSolution)
        setApproach(data.approach || initialApproach)
      } catch (error) {
        console.error("[v0] Error loading notes:", error)
      }
    }
  }, [problemId, initialNotes, initialSolution, initialApproach])

  const handleSave = () => {
    const storageKey = `problem_notes_${problemId}`
    localStorage.setItem(storageKey, JSON.stringify({ notes, solution, approach }))

    onSave?.(problemId, { notes, solution, approach })
    setHasChanges(false)
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    setHasChanges(true)
  }

  const handleSolutionChange = (value: string) => {
    setSolution(value)
    setHasChanges(true)
  }

  const handleApproachChange = (value: string) => {
    setApproach(value)
    setHasChanges(true)
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="notes" className="w-full">
        <div className="flex items-center justify-between mb-3">
          <TabsList>
            <TabsTrigger value="notes" className="gap-2">
              <StickyNote className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="solution" className="gap-2">
              <Code2 className="h-4 w-4" />
              Solution
            </TabsTrigger>
            <TabsTrigger value="approach" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Approach
            </TabsTrigger>
          </TabsList>

          {hasChanges && (
            <Button size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>

        <TabsContent value="notes" className="space-y-3">
          <div>
            <Label htmlFor="notes" className="text-xs text-muted-foreground mb-2 block">
              Personal notes and observations
            </Label>
            <Textarea
              id="notes"
              placeholder="Write your notes here..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="solution" className="space-y-3">
          <div>
            <Label htmlFor="solution" className="text-xs text-muted-foreground mb-2 block">
              Your code solution
            </Label>
            <Textarea
              id="solution"
              placeholder="Paste your solution code here..."
              value={solution}
              onChange={(e) => handleSolutionChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="approach" className="space-y-3">
          <div>
            <Label htmlFor="approach" className="text-xs text-muted-foreground mb-2 block">
              Problem-solving approach and pattern
            </Label>
            <Textarea
              id="approach"
              placeholder="Describe your approach, algorithms used, time/space complexity..."
              value={approach}
              onChange={(e) => handleApproachChange(e.target.value)}
              className="min-h-[200px] font-mono text-sm resize-none"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
