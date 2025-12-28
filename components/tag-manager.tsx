"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tag, Plus, X } from "lucide-react"
import { useState } from "react"

type TagManagerProps = {
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  onCreateTag?: (tag: string) => void
}

export function TagManager({ availableTags, selectedTags, onTagsChange, onCreateTag }: TagManagerProps) {
  const [newTag, setNewTag] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleCreateTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      onCreateTag?.(newTag.trim())
      setNewTag("")
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {selectedTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1.5">
            <Tag className="h-3 w-3" />
            {tag}
            <button onClick={() => toggleTag(tag)} className="hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 h-7 bg-transparent">
              <Plus className="h-3.5 w-3.5" />
              Add Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableTags.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              >
                {tag}
              </DropdownMenuCheckboxItem>
            ))}
            {availableTags.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">No tags available</div>
            )}
            <DropdownMenuSeparator />
            {!isCreating ? (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => setIsCreating(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                Create New Tag
              </Button>
            ) : (
              <div className="p-2 space-y-2">
                <Input
                  placeholder="Tag name..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateTag()
                    if (e.key === "Escape") {
                      setIsCreating(false)
                      setNewTag("")
                    }
                  }}
                  autoFocus
                  className="h-8"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateTag} className="flex-1 h-7">
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false)
                      setNewTag("")
                    }}
                    className="flex-1 h-7"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
