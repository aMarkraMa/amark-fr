import * as React from "react"
import {cn} from "@/lib/utils"
import { Slot } from "radix-ui"
export const Panel = ({className, ...props}: React.ComponentProps<"section">) => {
    return (
        <section
            data-slot="panel"
            className={cn(
                "screen-line-top screen-line-bottom border-x border-line",
                className
            )}
            {...props}
        />
    )
}
export function PanelTitle({
    className,
    asChild = false,
    ...props
  }: React.ComponentProps<"h2"> & { asChild?: boolean }) {
    const Comp = asChild ? Slot.Root : "h2"
  
    return (
      <Comp
        data-slot="panel-title"
        className={cn("text-3xl font-semibold tracking-tight", className)}
        {...props}
      />
    )
  }

export const PanelHeader = ({className, ...props}: React.ComponentProps<"header">) => {
    return (
        <header 
            data-slot="panel-header"
            className={cn(
                "screen-line-bottom px-4",
                className
            )}
            {...props}
        />
    )
}
export const PanelContent = ({className, ...props}: React.ComponentProps<"div">) => {
    return (
        <div 
            data-slot="panel-content"
            className={cn(
                "p-4",
                className
            )}
            {...props}
        />
    )
}