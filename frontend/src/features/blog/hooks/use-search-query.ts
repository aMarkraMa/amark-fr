import { useSearchParams } from "react-router-dom"

export function useSearchQuery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""

  const setQuery = (value: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) {
          next.set("q", value)
        } else {
          next.delete("q")
        }
        return next
      },
      { replace: true },
    )
  }

  return { query, setQuery }
}
