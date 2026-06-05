import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { getAllPosts } from "@/features/blog/data/posts"
import { cn } from "@/lib/utils"

const BLOG_DESCRIPTION =
  "A collection of articles on development, design, and ideas."

export const Blog = () => {
  const allPosts = getAllPosts()

  return (
    <div className="mx-auto min-h-[calc(100dvh-3.5rem)] border-x border-line md:max-w-3xl">
      <div
        className={cn(
          "screen-line-bottom h-8",
          "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56",
        )}
      />

      <div className="screen-line-bottom px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          Blog
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {BLOG_DESCRIPTION}
        </p>
      </div>

      <div className="screen-line-top screen-line-bottom p-2">
        <PostSearchInput />
      </div>

      <PostListWithSearch posts={allPosts} />

      <div className="h-4" />
    </div>
  )
}
