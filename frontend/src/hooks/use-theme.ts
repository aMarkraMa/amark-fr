import { useSyncExternalStore } from "react"

type Theme = "light" | "dark"

const STORAGE_KEY = "amark-theme"
const THEME_EVENT = "amark-theme-change"
const SYSTEM_THEME = "(prefers-color-scheme: dark)"

function readPreference(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "light" || value === "dark" ? value : null
  } catch {
    return null
  }
}

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  window.dispatchEvent(new Event(THEME_EVENT))
}

function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Switching themes should also work without persistent storage.
  }
  applyTheme(theme)
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(SYSTEM_THEME)
  const syncPreference = () => {
    applyTheme(readPreference() ?? (media.matches ? "dark" : "light"))
  }
  const onSystemChange = () => {
    if (!readPreference()) syncPreference()
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) syncPreference()
  }

  window.addEventListener(THEME_EVENT, onChange)
  window.addEventListener("storage", onStorage)
  media.addEventListener("change", onSystemChange)
  syncPreference()

  return () => {
    window.removeEventListener(THEME_EVENT, onChange)
    window.removeEventListener("storage", onStorage)
    media.removeEventListener("change", onSystemChange)
  }
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as const)
  return { theme, setTheme }
}
