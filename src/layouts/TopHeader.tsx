import { Menu, Moon, Sun } from "lucide-react"

interface TopHeaderProps {
  onToggleSidebar: () => void
  isDarkMode: boolean
  onToggleTheme: () => void
}

export function TopHeader({
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
}: TopHeaderProps) {
  return (
    <header className="h-14 bg-[#111318] border-b border-[#2D3748] flex items-center px-4 sm:px-6 gap-3 shrink-0 justify-between">
      <div className="flex items-center gap-2 text-sm min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Alternar barra lateral"
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E232D] transition-colors cursor-pointer mr-1"
        >
          <Menu size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          className="p-2 rounded-lg text-[#94A3B8] hover:bg-[#242830] hover:text-[#F1F5F9] transition-colors border border-[#2D3748] cursor-pointer"
        >
          {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  )
}
