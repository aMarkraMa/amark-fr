import { MoonIcon, SunIcon } from "lucide-react"
import { motion } from "motion/react"

import { IconSwap, IconSwapItem } from "@/components/icon-swap"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-10 rounded-full text-muted-foreground hover:text-foreground"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative flex size-4 items-center justify-center" aria-hidden="true">
        <IconSwap>
          <IconSwapItem key={theme} as={motion.span} className="inline-flex">
            {isDark ? <SunIcon /> : <MoonIcon />}
          </IconSwapItem>
        </IconSwap>
      </span>
    </Button>
  )
}
