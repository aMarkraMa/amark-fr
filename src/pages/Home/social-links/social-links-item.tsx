import type { SocialLink } from "../types/social-links"
import { ArrowUpRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
export function SocialLinkItem({ icon, title, href }: SocialLink){
    return (
        <a className={cn(
            "group flex items-center gap-4 p-4",
            "hover:bg-accent-muted transition-[background-color] ease-out",
            "screen-line-top screen-line-bottom"
        )}
            href={href} target="_blank" rel="noopener">
            <div className="size-8 shrink-0">
                <img className="rounded-lg select-none " src={icon} alt={title}/>
            </div>
            <h3 className="flex-1 font-medium">{title}</h3>
            <ArrowUpRightIcon className="size-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45" />
        </a>
    )
}