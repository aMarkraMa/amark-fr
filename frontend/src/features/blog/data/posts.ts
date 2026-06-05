import { getPostTimestamp } from "@/features/blog/lib/format-post-date"
import { parseFrontmatter } from "@/features/blog/lib/parse-frontmatter"
import type { Post, PostMetadata } from "@/features/blog/types/post"

const postModules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function parsePost(filePath: string, rawContent: string): Post {
  const { metadata, content } = parseFrontmatter(rawContent)
  const slug = filePath.split("/").pop()!.replace(/\.md$/, "")

  return {
    metadata: metadata as PostMetadata,
    slug,
    content,
  }
}

export function getAllPosts(): Post[] {
  return Object.entries(postModules)
    .map(([filePath, rawContent]) => parsePost(filePath, rawContent))
    .sort((a, b) => {
      if (a.metadata.pinned && !b.metadata.pinned) return -1
      if (!a.metadata.pinned && b.metadata.pinned) return 1

      return (
        getPostTimestamp(b.metadata.createdAt) -
        getPostTimestamp(a.metadata.createdAt)
      )
    })
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}

export function findNeighbour(posts: Post[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug)

  if (index === -1) {
    return { previous: null, next: null }
  }

  return {
    previous: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  }
}
