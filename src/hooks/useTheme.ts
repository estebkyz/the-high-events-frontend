import { useEffect, useState } from "react"

const STORAGE_KEY = "the_high_events_theme"

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? saved === "dark" : true
    } catch {
      return true
    }
  })

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.setAttribute("data-theme", "dark")
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("dark")
        localStorage.setItem(STORAGE_KEY, "dark")
      } else {
        document.documentElement.setAttribute("data-theme", "light")
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
        localStorage.setItem(STORAGE_KEY, "light")
      }
      window.dispatchEvent(
        new CustomEvent("themechange", {
          detail: { theme: isDarkMode ? "dark" : "light" },
        }),
      )
    } catch {
      // storage restrictions fallback
    }
  }, [isDarkMode])

  // Varias partes usan el tema (la app lo aplica al cargar; Perfil lo cambia): se mantienen iguales
  useEffect(() => {
    const sync = (e: Event) => {
      const theme = (e as CustomEvent<{ theme: string }>).detail?.theme
      if (theme) setIsDarkMode(theme === "dark")
    }
    window.addEventListener("themechange", sync)
    return () => window.removeEventListener("themechange", sync)
  }, [])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)
  const setTheme = (theme: "light" | "dark") => setIsDarkMode(theme === "dark")

  return { isDarkMode, toggleTheme, setTheme }
}
