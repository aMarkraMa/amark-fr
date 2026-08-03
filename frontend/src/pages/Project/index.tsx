import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { getAllProjects } from "@/features/project/data/projects"
import { cn } from "@/lib/utils"

const PROJECT_DESCRIPTION =
  "Here are some projects I worked on during school and in my spare time, including frontend/backend development, algorithms, artificial intelligence, and more."

export const Project = () => {
  const allProjects = getAllProjects()

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
          Project
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          {PROJECT_DESCRIPTION}
        </p>
      </div>

      <div className="screen-line-top screen-line-bottom p-2">
        <PostSearchInput placeholder="Search Project…" />
      </div>

      <PostListWithSearch
        posts={allProjects}
        basePath="/project"
        columns={1}
        emptyMessage="No projects found."
      />

      <div className="h-4" />
    </div>
  )
}
