"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, X } from "lucide-react"

type FilterState = {
  difficulties: Set<string>
  statuses: Set<string>
  companies: Set<string>
}

type SearchFilterBarProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  showCompanyFilter?: boolean
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"]
const STATUSES = ["Completed", "Pending", "In Progress"]
const COMPANIES = ["Google", "Meta", "Amazon", "Microsoft", "Apple", "Netflix"]

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  showCompanyFilter = false,
}: SearchFilterBarProps) {
  const activeFilterCount = filters.difficulties.size + filters.statuses.size + filters.companies.size

  const clearAllFilters = () => {
    onFilterChange({
      difficulties: new Set(),
      statuses: new Set(),
      companies: new Set(),
    })
  }

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulties = new Set(filters.difficulties)
    if (newDifficulties.has(difficulty)) {
      newDifficulties.delete(difficulty)
    } else {
      newDifficulties.add(difficulty)
    }
    onFilterChange({ ...filters, difficulties: newDifficulties })
  }

  const toggleStatus = (status: string) => {
    const newStatuses = new Set(filters.statuses)
    if (newStatuses.has(status)) {
      newStatuses.delete(status)
    } else {
      newStatuses.add(status)
    }
    onFilterChange({ ...filters, statuses: newStatuses })
  }

  const toggleCompany = (company: string) => {
    const newCompanies = new Set(filters.companies)
    if (newCompanies.has(company)) {
      newCompanies.delete(company)
    } else {
      newCompanies.add(company)
    }
    onFilterChange({ ...filters, companies: newCompanies })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
            {DIFFICULTIES.map((difficulty) => (
              <DropdownMenuCheckboxItem
                key={difficulty}
                checked={filters.difficulties.has(difficulty)}
                onCheckedChange={() => toggleDifficulty(difficulty)}
              >
                {difficulty}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {STATUSES.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.statuses.has(status)}
                onCheckedChange={() => toggleStatus(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}

            {showCompanyFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Company</DropdownMenuLabel>
                {COMPANIES.map((company) => (
                  <DropdownMenuCheckboxItem
                    key={company}
                    checked={filters.companies.has(company)}
                    onCheckedChange={() => toggleCompany(company)}
                  >
                    {company}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="icon" onClick={clearAllFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Array.from(filters.difficulties).map((difficulty) => (
            <Badge key={difficulty} variant="secondary" className="gap-1.5">
              {difficulty}
              <button onClick={() => toggleDifficulty(difficulty)} className="hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {Array.from(filters.statuses).map((status) => (
            <Badge key={status} variant="secondary" className="gap-1.5">
              {status}
              <button onClick={() => toggleStatus(status)} className="hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {Array.from(filters.companies).map((company) => (
            <Badge key={company} variant="secondary" className="gap-1.5">
              {company}
              <button onClick={() => toggleCompany(company)} className="hover:text-foreground">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

export type { FilterState }
