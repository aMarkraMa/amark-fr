export type PostMetadata = {
  title?: string
  description?: string
  image?: string
  category?: string
  link?: string
  pdf?: string
  new?: boolean
  pinned?: boolean
  createdAt?: string
  updatedAt?: string
}

export type Post = {
  metadata: PostMetadata
  slug: string
  content: string
}
