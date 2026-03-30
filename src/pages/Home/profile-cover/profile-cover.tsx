import {cn} from '@/lib/utils'
export function ProfileCover(){
    return(
        <div className={cn(
          "aspect-2/1 border-x border-line select-none sm:aspect-3/1 min-h-40 w-full",
          "flex items-center justify-center text-black dark:text-white",
          "screen-line-top screen-line-bottom before:-top-px after:-bottom-px",
          "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
        )}
        />


    )
}