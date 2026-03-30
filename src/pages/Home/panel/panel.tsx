import * as React from "react"
import {cn} from "@/lib/utils"
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