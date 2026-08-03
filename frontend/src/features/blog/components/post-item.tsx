import { Link } from "react-router-dom"

import { formatPostDate } from "@/features/blog/lib/format-post-date"
import type { Post } from "@/features/blog/types/post"
import { cn } from "@/lib/utils"

export function PostItem({
  post,
  shouldPreloadImage,
  basePath = "/blog",
  fullWidth = false,
}: {
  post: Post
  shouldPreloadImage?: boolean
  basePath?: string
  fullWidth?: boolean
}) {
  const publishedAt = formatPostDate(post.metadata.createdAt)

  return (
    <Link
      to={`${basePath}/${post.slug}`}
      className={cn(
        "group flex flex-col gap-2 p-2 transition-[background-color] ease-out hover:bg-accent-muted",
        fullWidth
          ? "screen-line-top screen-line-bottom"
          : [
              "max-sm:screen-line-top max-sm:screen-line-bottom",
              "sm:nth-[2n+1]:screen-line-top sm:nth-[2n+1]:screen-line-bottom",
            ],
      )}
    >
      {post.metadata.image && (
        <div className="relative select-none">
          <img
            src={post.metadata.image}
            alt={post.metadata.title}
            width={1200}
            height={630}
            loading={shouldPreloadImage ? "eager" : "lazy"}
            className={cn(
              "w-full rounded-xl aspect-1200/630",
              // Keep Blog image height on wide cards; title stays below.
              fullWidth && "sm:aspect-4/1 sm:object-cover",
            )}
          />

          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
        </div>
      )}

      <div className="flex flex-col gap-1 p-2">
        <h3 className="text-lg leading-snug font-medium text-balance">
          {post.metadata.title || post.slug}
          {post.metadata.new && (
            <span className="ml-2 inline-block size-2 -translate-y-px rounded-full bg-info">
              <span className="sr-only">New</span>
            </span>
          )}
        </h3>

        {publishedAt && (
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-sm text-muted-foreground">
              <time dateTime={publishedAt.iso}>{publishedAt.display}</time>
            </dd>
          </dl>
        )}
      </div>
    </Link>
  )
}
