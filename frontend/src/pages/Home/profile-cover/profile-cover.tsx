import {useEffect, useRef} from 'react'
import {cn} from '@/lib/utils'
import amarkLogo from "/assets/logos/logo-amark.svg"

const SPOT_MASK =
  "radial-gradient(circle 3.5rem at var(--spot-x) var(--spot-y), black 20%, transparent 70%)"
const TRAIL_MASK =
  "radial-gradient(circle 3.5rem at var(--trail-x) var(--trail-y), rgba(0,0,0,0.4) 10%, transparent 70%)"

export function ProfileCover(){
    const coverRef = useRef<HTMLDivElement>(null)
    const targetRef = useRef({x: 0, y: 0})
    const spotRef = useRef({x: 0, y: 0})
    const trailRef = useRef({x: 0, y: 0})
    const rafRef = useRef(0)

    function setPoint(
      event: React.PointerEvent<HTMLDivElement>,
      snap = false,
    ){
        const node = coverRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        targetRef.current = {x, y}
        if (snap){
            spotRef.current = {x, y}
            trailRef.current = {x, y}
            node.style.setProperty("--spot-x", `${x}px`)
            node.style.setProperty("--spot-y", `${y}px`)
            node.style.setProperty("--trail-x", `${x}px`)
            node.style.setProperty("--trail-y", `${y}px`)
        }
        if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }

    function tick(){
        const node = coverRef.current
        if (!node){
            rafRef.current = 0
            return
        }
        const target = targetRef.current
        const spot = spotRef.current
        const trail = trailRef.current
        spot.x += (target.x - spot.x) * 0.34
        spot.y += (target.y - spot.y) * 0.34
        trail.x += (target.x - trail.x) * 0.13
        trail.y += (target.y - trail.y) * 0.13
        node.style.setProperty("--spot-x", `${spot.x}px`)
        node.style.setProperty("--spot-y", `${spot.y}px`)
        node.style.setProperty("--trail-x", `${trail.x}px`)
        node.style.setProperty("--trail-y", `${trail.y}px`)
        const settled =
          Math.abs(spot.x - target.x) < 0.2 &&
          Math.abs(spot.y - target.y) < 0.2 &&
          Math.abs(trail.x - target.x) < 0.2 &&
          Math.abs(trail.y - target.y) < 0.2
        rafRef.current = settled ? 0 : requestAnimationFrame(tick)
    }

    useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

    return(
        <div
          ref={coverRef}
          onPointerEnter={(event) => setPoint(event, true)}
          onPointerMove={(event) => setPoint(event)}
          className={cn(
            "group/cover relative aspect-2/1 border-x border-line select-none sm:aspect-3/1 min-h-40 w-full",
            "flex items-center justify-center text-black dark:text-white",
            "screen-line-top screen-line-bottom before:-top-px after:-bottom-px",
            "bg-black/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
          )}
          style={{
            "--spot-x": "50%",
            "--spot-y": "50%",
            "--trail-x": "50%",
            "--trail-y": "50%",
          } as React.CSSProperties}
        >
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0",
                "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
                "[--pattern-foreground:var(--color-zinc-950)]/55 dark:[--pattern-foreground:var(--color-white)]/55",
                "[mask-image:var(--amark-logo)] [-webkit-mask-image:var(--amark-logo)]",
                "[mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]",
                "[mask-position:center] [-webkit-mask-position:center]",
                "[mask-size:72%_auto] [-webkit-mask-size:72%_auto]"
              )}
              style={{"--amark-logo": `url("${amarkLogo}")`} as React.CSSProperties}
            />
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
                "[@media(hover:hover)]:group-hover/cover:opacity-100",
                "bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center",
                "[--pattern-foreground:var(--color-zinc-950)]/55 dark:[--pattern-foreground:var(--color-white)]/55"
              )}
              style={{
                maskImage: `${SPOT_MASK}, ${TRAIL_MASK}`,
                WebkitMaskImage: `${SPOT_MASK}, ${TRAIL_MASK}`,
                maskComposite: "add",
                WebkitMaskComposite: "source-over",
              }}
            />
        </div>
    )
}
