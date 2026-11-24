import { useEffect, useRef, useState } from "react"
import { ChevronUp, LogOut } from "lucide-react"
import type { UserProfile } from "@/services/session"

interface UserMenuProps {
  user: UserProfile | null
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const name = user?.name || user?.email || "Mi cuenta"

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isOpen])

  return (
    <div
      ref={rootRef}
      className="relative p-3 border-t border-[#CBD5E1] dark:border-[#2D3748] shrink-0"
    >
      {isOpen && (
        <div className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#1A1D23] border border-[#CBD5E1] dark:border-[#2D3748] rounded-xl shadow-xl p-3 z-50 space-y-2.5">
          <div>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
              {name}
            </p>
            {user?.email && (
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] truncate">
                {user.email}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-[#334155] dark:text-[#CBD5E1] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut size={14} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#F1F5F9] dark:hover:bg-[#1A1D23] transition-colors cursor-pointer"
      >
        <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
          {name}
        </span>
        <ChevronUp
          size={15}
          aria-hidden="true"
          className={`text-[#334155] dark:text-[#CBD5E1] shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  )
}
