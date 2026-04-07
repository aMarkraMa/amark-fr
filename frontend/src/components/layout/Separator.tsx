import { cn } from "@/lib/utils"
export function Separator({ className }: {className?:String}){
    return (
        <div className={cn("relative w-full h-8 border-x border-line",
            "before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)]",
            "before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-line)]/56",
            className
        )}/>
    )
}