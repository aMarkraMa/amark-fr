import { ArrowLeftIcon, ArrowRightIcon, ArrowUpRightIcon } from "lucide-react"
import { Link, Navigate, useParams } from "react-router-dom"

import { Markdown } from "@/components/markdown"
import { PdfEmbed } from "@/components/pdf-embed"
import { Button } from "@/components/ui/button"
import { Prose } from "@/components/ui/typegraphy"
import { PostKeyboardShortcuts } from "@/features/blog/components/post-keyboard-shortcuts"
import {
  findNeighbour,
  getAllProjects,
  getProjectBySlug,
} from "@/features/project/data/projects"
import { cn } from "@/lib/utils"

export const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <Navigate to="/project" replace />
  }

  const project = getProjectBySlug(slug)

  if (!project) {
    return <Navigate to="/project" replace />
  }

  const allProjects = getAllProjects()
  const { previous, next } = findNeighbour(allProjects, slug)

  return (
    <div className="mx-auto min-h-[calc(100dvh-3.5rem)] border-x border-line md:max-w-3xl">
      <PostKeyboardShortcuts
        basePath="/project"
        previous={previous}
        next={next}
      />

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 border-none px-0 font-mono text-muted-foreground hover:text-foreground"
          variant="link"
          size="sm"
          asChild
        >
          <Link to="/project">
            <ArrowLeftIcon />
            Project
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          {previous && (
            <Button
              className="size-7 border-none"
              variant="secondary"
              size="icon-sm"
              asChild
              title="Previous project"
            >
              <Link to={`/project/${previous.slug}`}>
                <ArrowLeftIcon />
                <span className="sr-only">Previous</span>
              </Link>
            </Button>
          )}

          {next && (
            <Button
              className="size-7 border-none"
              variant="secondary"
              size="icon-sm"
              asChild
              title="Next project"
            >
              <Link to={`/project/${next.slug}`}>
                <span className="sr-only">Next</span>
                <ArrowRightIcon />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="screen-line-top screen-line-bottom">
        <div
          className={cn(
            "h-8",
            "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56",
          )}
        />
      </div>

      <Prose className="px-4">
        <h1 className="screen-line-bottom text-3xl font-semibold tracking-tight">
          {project.metadata.title}
        </h1>

        <p className="text-muted-foreground">{project.metadata.description}</p>

        {project.metadata.link && (
          <p>
            <Button className="h-8 gap-1.5 font-mono" variant="secondary" asChild>
              <a
                href={project.metadata.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Demo
                <ArrowUpRightIcon />
              </a>
            </Button>
          </p>
        )}

        <div>
          <Markdown>{project.content}</Markdown>
        </div>

        {project.metadata.pdf && (
          <PdfEmbed
            src={project.metadata.pdf}
            title={project.metadata.title}
            heading="Dossier de cadrage"
          />
        )}
      </Prose>

      <div className="screen-line-top h-4 w-full" />
    </div>
  )
}
