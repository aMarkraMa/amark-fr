import { SearchIcon, XIcon } from "lucide-react"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { useSearchQuery } from "../hooks/use-search-query"

export function PostSearchInput() {
  const { query, setQuery } = useSearchQuery()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuery(null)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setQuery])

  return (
    <div className="relative flex items-center">
      <SearchIcon className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />

      <Input
        className={cn("rounded-lg pl-8 shadow-none", query.length > 0 && "pr-8")}
        placeholder="Search Blog…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
        }}
      />

      {query.length > 0 && (
        <Button
          className="absolute right-1 size-6 border-none"
          variant="ghost"
          size="icon-xs"
          title="Clear"
          aria-label="Clear"
          onClick={() => setQuery(null)}
        >
          <XIcon />
        </Button>
      )}
    </div>
  )
}
