import { USER } from "@/pages/Home/data/user"
import { VerifiedIcon } from "./verified-icon"
import { TextFlip } from "./text-flip"

export function ProfileHeader(){
    return (
        <div className="border-x screen-line-bottom flex border-line">
            <div className="shrink-0 border-r border-line">
                <div className="mx-0.5 my-0.75">
                    <img className="size-30 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40" 
                        src={USER.avatarUrl} alt={`${USER.firstName} ${USER.lastName}`} />
                </div>
            </div>
            <div className="flex flex-1 flex-col">
                <div className="flex grow items-end pb-1 pl-4">
                    <div className="font-mono text-xs text-zinc-300 select-none line-clamp-1 max-sm:hidden">
                        {"giving up is not an option"}
                    </div>
                </div>
                <div className="border-t border-line">
                    <div className="flex items-center gap-2 pl-4">
                        <h1 className="-translate-y-px text-3xl tracking-tight">
                            {USER.firstName} {USER.lastName} 
                        </h1>
                        <VerifiedIcon className="size-4.5 text-info select-none" />
                        
                    </div>
                    <div className="h-12.5 border-t border-line py-1 pl-4 sm:h-9">
                        <TextFlip className="font-pixel-square text-sm text-balance text-muted-foreground"
                                variants={{
                                            initial: { y: -10, opacity: 0 },
                                            animate: { y: -1, opacity: 1 },
                                            exit: { y: 10, opacity: 0 },
                                          }}
                                          interval={1.5}>
                            {USER.flipSentences}
                        </TextFlip>
                    </div>
                </div>
            </div>
        </div>
    )
}
