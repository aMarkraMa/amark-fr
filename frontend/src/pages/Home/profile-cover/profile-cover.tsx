import TechText from "@/components/TechText"
import { cn } from "@/lib/utils"

export function ProfileCover() {
  return (
    <div
      className={cn(
        "relative isolate aspect-2/1 min-h-40 w-full border-x border-line sm:aspect-3/1",
        "screen-line-top screen-line-bottom before:-top-px after:-bottom-px",
        "bg-background text-foreground",
        "bg-[radial-gradient(var(--line)_1px,transparent_1px)] bg-size-[10px_10px] bg-center",
      )}
    >
      <div className="absolute inset-0 overflow-hidden px-4 sm:px-8">
        <TechText
          text="aMark"
          fontSize={180}
          fontWeight={600}
          color="currentColor"
          accentColor="currentColor"
          reveal="letter"
          intro="metrics"
          guides
        />
      </div>
    </div>
  )
}
