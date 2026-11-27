import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { Search } from "lucide-react"
import { useCan } from "@/hooks/useAccess"
import type { RouteId } from "@/types"
import { matchesSearch } from "@/utils/list"
import { allowedNavigation } from "./navigation"

interface GlobalSearchProps {
  onNavigate: (route: RouteId) => void
}

/** Buscador de módulos (Ctrl + K): escribe y salta a cualquier pantalla. */
export function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const baseId = useId()
  const listId = `${baseId}-list`
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const { home, sections } = allowedNavigation(useCan())
  const modules = [
    ...(home ? [{ ...home, section: "" }] : []),
    ...sections.flatMap((s) => s.items.map((item) => ({ ...item, section: s.title }))),
  ]
  const results = modules.filter((m) => matchesSearch(query, [m.label, m.section]))
  const optionId = (index: number) => `${baseId}-opt-${index}`
  const activeId = optionId(activeIndex)

  useEffect(() => {
    const onShortcut = (e: globalThis.KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k" || !(e.ctrlKey || e.metaKey)) return
      // Con un modal abierto, el foco se queda en el modal.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      e.preventDefault()
      inputRef.current?.focus()
      setIsOpen(true)
    }
    window.addEventListener("keydown", onShortcut)
    return () => window.removeEventListener("keydown", onShortcut)
  }, [])

  useEffect(() => {
    if (isOpen) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" })
  }, [isOpen, activeId])

  const close = () => {
    setIsOpen(false)
    setQuery("")
    setActiveIndex(0)
  }

  const choose = (index: number) => {
    const module = results[index]
    if (!module) return
    inputRef.current?.blur()
    close()
    onNavigate(module.route)
  }

  const keyActions: Record<string, () => void> = {
    ArrowDown: () => setActiveIndex((i) => Math.min(results.length - 1, i + 1)),
    ArrowUp: () => setActiveIndex((i) => Math.max(0, i - 1)),
    Enter: () => choose(activeIndex),
    Escape: close,
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const action = keyActions[e.key]
    if (!action) return
    e.preventDefault()
    if (isOpen) action()
    else if (e.key !== "Escape") setIsOpen(true)
  }

  return (
    <div className="relative w-full max-w-[560px]">
      <Search
        size={15}
        aria-hidden="true"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-topbar-muted pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-label="Buscar módulo"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen && results.length > 0 ? activeId : undefined}
        aria-keyshortcuts="Control+K"
        autoComplete="off"
        placeholder="Buscar módulo"
        value={query}
        onClick={() => setIsOpen(true)}
        onBlur={close}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setIsOpen(true)
          setQuery(e.target.value)
          setActiveIndex(0)
        }}
        className="w-full h-9 pl-9 pr-3 sm:pr-20 rounded-lg bg-topbar-field border border-topbar-line text-base sm:text-[13px] text-topbar-ink placeholder:text-topbar-muted focus:outline-2 focus:outline-brand-line"
      />
      <kbd
        aria-hidden="true"
        className="max-sm:hidden absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-topbar text-[11px] font-sans font-medium text-topbar-muted pointer-events-none"
      >
        Ctrl K
      </kbd>
      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Módulos"
          // Elegir con el puntero no debe quitarle el foco al campo antes de tiempo.
          onMouseDown={(e) => e.preventDefault()}
          className="absolute inset-x-0 max-sm:-left-20 top-full mt-2 z-50 max-h-[min(420px,70vh)] overflow-y-auto p-1.5 rounded-xl bg-surface shadow-popover"
        >
          {results.map(({ route, label, section, icon: Icon }, index) => (
            <li
              key={route}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => choose(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-[13px] font-medium text-ink ${
                index === activeIndex ? "bg-hover" : ""
              }`}
            >
              <Icon size={16} aria-hidden="true" className="shrink-0 text-ink-muted" />
              <span className="flex-1 min-w-0 truncate">{label}</span>
              <span className="text-xs font-normal text-ink-muted truncate">
                {section}
              </span>
            </li>
          ))}
          {results.length === 0 && (
            <li className="px-2.5 py-3 text-[13px] text-ink-muted">
              Ningún módulo coincide.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
