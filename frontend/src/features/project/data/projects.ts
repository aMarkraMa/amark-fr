import { findNeighbour } from "@/features/blog/data/posts"
import { getPostTimestamp } from "@/features/blog/lib/format-post-date"
import { parseFrontmatter } from "@/features/blog/lib/parse-frontmatter"
import type { Post, PostMetadata } from "@/features/blog/types/post"

const projectModules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function parseProject(filePath: string, rawContent: string): Post {
  const { metadata, content } = parseFrontmatter(rawContent)
  const slug = filePath.split("/").pop()!.replace(/\.md$/, "")

  return {
    metadata: metadata as PostMetadata,
    slug,
    content,
  }
}

export function getAllProjects(): Post[] {
  return Object.entries(projectModules)
    .map(([filePath, rawContent]) => parseProject(filePath, rawContent))
    .sort((a, b) => {
      if (a.metadata.pinned && !b.metadata.pinned) return -1
      if (!a.metadata.pinned && b.metadata.pinned) return 1

      return (
        getPostTimestamp(b.metadata.createdAt) -
        getPostTimestamp(a.metadata.createdAt)
      )
    })
}

export function getProjectBySlug(slug: string): Post | undefined {
  return getAllProjects().find((project) => project.slug === slug)
}

export { findNeighbour }
