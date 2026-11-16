import { Bell, Menu, Sun, Moon } from "lucide-react"

interface TopHeaderProps {
  onToggleSidebar?: () => void
  isDarkMode?: boolean
  onToggleTheme?: () => void
}

export default function TopHeader({
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
}: TopHeaderProps) {
  return (
    <header className="h-14 bg-[#111318] border-b border-[#2D3748] flex items-center px-4 sm:px-6 gap-3 shrink-0 justify-between">
      {/* Left: Sidebar toggle */}
      <div className="flex items-center gap-2 text-sm min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Alternar barra lateral"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E232D] transition-colors cursor-pointer mr-1"
          >
            <Menu size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme toggle if available */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
            title={
              isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            }
            className="p-2 rounded-lg text-[#94A3B8] hover:bg-[#242830] hover:text-[#F1F5F9] transition-colors border border-[#2D3748] cursor-pointer"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notificaciones del sistema"
          className="relative p-2 rounded-lg text-[#94A3B8] hover:bg-[#242830] hover:text-[#F1F5F9] transition-colors border border-[#2D3748] cursor-pointer"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full ring-2 ring-[#111318]" />
        </button>
      </div>
    </header>
  )
}
