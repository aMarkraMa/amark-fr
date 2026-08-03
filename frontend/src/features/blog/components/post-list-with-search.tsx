import type { ComponentProps } from "react"

import type { Post } from "@/features/blog/types/post"

import { useFilteredPosts } from "../hooks/use-filtered-posts"
import { PostList } from "./post-list"

export function PostListWithSearch({
  posts,
  ...listProps
}: { posts: Post[] } & Omit<ComponentProps<typeof PostList>, "posts">) {
  const filteredPosts = useFilteredPosts(posts)
  return <PostList posts={filteredPosts} {...listProps} />
}
