import { useEffect, useRef, useState } from "react"
import { LogOut, UserCog } from "lucide-react"
import type { UserProfile } from "@/services/session"

interface UserMenuProps {
  user: UserProfile | null
  onLogout: () => void
  onProfile: () => void
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

export function UserMenu({ user, onLogout, onProfile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const name = user?.name || user?.email || "Mi cuenta"

  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setIsOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-label={`Cuenta de ${name}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className="max-w-full h-9 pl-2.5 max-lg:pl-1 pr-1 inline-flex items-center gap-2 rounded-lg hover:bg-topbar-field transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand-line"
      >
        <span className="max-lg:hidden min-w-0 truncate text-[13px] font-medium text-topbar-ink">
          {name}
        </span>
        <span
          aria-hidden="true"
          className="size-7 shrink-0 rounded-lg bg-brand text-white text-[11px] font-semibold inline-flex items-center justify-center"
        >
          {getInitials(name)}
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-60 p-1.5 rounded-xl bg-surface shadow-popover">
          <div className="px-2.5 py-2">
            <p className="text-[13px] font-semibold text-ink truncate">{name}</p>
            {user?.email && (
              <p className="text-xs text-ink-muted truncate">{user.email}</p>
            )}
          </div>
          <div className="h-px bg-line-soft my-1" />
          <button
            type="button"
            onClick={() => {
              setIsOpen(false)
              onProfile()
            }}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium text-ink hover:bg-hover transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
          >
            <UserCog size={15} aria-hidden="true" className="text-ink-muted" />
            Perfil
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium text-ink hover:bg-hover transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
          >
            <LogOut size={15} aria-hidden="true" className="text-ink-muted" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
