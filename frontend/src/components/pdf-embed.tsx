import { ArrowUpRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PdfEmbed({
  src,
  title,
  heading,
}: {
  src: string
  title?: string
  heading?: string
}) {
  return (
    <div className="not-prose my-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        {heading ? (
          <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
        ) : (
          <span />
        )}
        <Button
          className="h-8 gap-1.5 font-mono"
          variant="outline"
          size="sm"
          asChild
        >
          <a href={src} target="_blank" rel="noopener noreferrer">
            Ouvrir le PDF
            <ArrowUpRightIcon />
          </a>
        </Button>
      </div>
      <iframe
        title={title ? `PDF — ${title}` : "PDF"}
        src={src}
        className="h-[min(85vh,900px)] w-full rounded-lg border border-line bg-background"
      />
    </div>
  )
}
