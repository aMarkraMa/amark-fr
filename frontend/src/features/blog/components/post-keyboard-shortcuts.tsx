import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import type { Post } from "@/features/blog/types/post"

export function PostKeyboardShortcuts({
  basePath,
  previous,
  next,
}: {
  basePath: string
  previous: Post | null
  next: Post | null
}) {
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA")
      ) {
        return
      }

      if (event.key === "ArrowRight" && next) {
        navigate(`${basePath}/${next.slug}`)
      }

      if (event.key === "ArrowLeft" && previous) {
        navigate(`${basePath}/${previous.slug}`)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [basePath, navigate, next, previous])

  return null
}
