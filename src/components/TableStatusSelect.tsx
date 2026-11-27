import { useId, useRef, useState, type KeyboardEvent } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { StatusBadge } from "@/components/StatusBadge"
import { StatusMenu } from "@/components/StatusMenu"
import { useModuleAccess } from "@/hooks/useAccess"
import { getStatusClasses } from "@/utils/statusTones"

interface TableStatusSelectProps<S extends string> {
  status: S
  options: readonly S[]
  /** Si devuelve una promesa, el control muestra "guardando" hasta que se resuelva. */
  onChange?: (newStatus: S) => unknown
  disabled?: boolean
  /** Contexto para lectores de pantalla, p. ej. "Estado de AudioPro Colombia". */
  ariaLabel?: string
}

export function TableStatusSelect<S extends string>({
  status,
  options,
  onChange,
  disabled = false,
  ariaLabel = "Estado",
}: TableStatusSelectProps<S>) {
  const { canChangeStatus } = useModuleAccess()
  const menuId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const tone = getStatusClasses(status)

  if (disabled || !canChangeStatus || !onChange || options.length === 0) {
    return <StatusBadge status={status} />
  }

  const close = (returnFocus: boolean) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const choose = async (next: S) => {
    close(true)
    if (next === status) return
    setSaving(true)
    try {
      await onChange(next)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (saving || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return
    e.preventDefault()
    setOpen(true)
  }

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current && !saving)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-disabled={saving}
        aria-busy={saving}
        aria-label={`${ariaLabel}: ${status}. ${saving ? "Guardando" : "Cambiar"}`}
        className={`min-h-6 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium whitespace-nowrap transition-shadow select-none ${tone.bg} ${tone.text} ${
          saving
            ? "cursor-wait opacity-80"
            : "cursor-pointer hover:ring-1 hover:ring-current/40"
        } focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand`}
      >
        <span aria-hidden="true" className={`size-1.5 rounded-full ${tone.dot}`} />
        <span>{status}</span>
        {saving ? (
          <Loader2
            size={11}
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        ) : (
          <ChevronDown
            size={11}
            aria-hidden="true"
            className={`opacity-70 transition-transform duration-150 motion-reduce:transition-none ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {open && (
        <StatusMenu
          id={menuId}
          label={`${ariaLabel}: seleccionar nuevo valor`}
          options={options}
          selected={status}
          anchorRef={triggerRef}
          onChoose={(option) => void choose(option)}
          onClose={close}
        />
      )}
    </div>
  )
}
