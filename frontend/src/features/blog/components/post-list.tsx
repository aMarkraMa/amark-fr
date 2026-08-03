import type { Post } from "@/features/blog/types/post"
import { cn } from "@/lib/utils"

import { PostItem } from "./post-item"

export function PostList({
  posts,
  basePath = "/blog",
  columns = 2,
  emptyMessage = "No posts found.",
}: {
  posts: Post[]
  basePath?: string
  columns?: 1 | 2
  emptyMessage?: string
}) {
  const fullWidth = columns === 1

  return (
    <div className="relative pt-4">
      {!fullWidth && (
        <div className="absolute inset-0 -z-1 grid grid-cols-1 gap-4 max-sm:hidden sm:grid-cols-2">
          <div className="border-r border-line" />
          <div className="border-l border-line" />
        </div>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-4",
          !fullWidth && "sm:grid-cols-2",
        )}
      >
        {posts.map((post, index) => (
          <PostItem
            key={post.slug}
            post={post}
            basePath={basePath}
            fullWidth={fullWidth}
            shouldPreloadImage={index <= 4}
          />
        ))}

        {posts.length === 0 && (
          <div className="screen-line-top screen-line-bottom p-4">
            <p className="font-mono text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  )
}
