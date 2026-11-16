import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ChevronDown, Check, Loader2 } from "lucide-react"

export type StatusTone = "success" | "warning" | "danger" | "info" | "accent" | "neutral"

export interface ToneClasses {
  bg: string
  text: string
  hoverBg: string
}

// Las clases se escriben completas (no se arman con plantillas) para que Tailwind las detecte.
export const TONE_CLASSES: Record<StatusTone, ToneClasses> = {
  success: { bg: "bg-[#10B981]/15", text: "text-[#34D399]", hoverBg: "hover:bg-[#10B981]/25" },
  warning: { bg: "bg-[#F59E0B]/15", text: "text-[#FBBF24]", hoverBg: "hover:bg-[#F59E0B]/25" },
  danger: { bg: "bg-[#EF4444]/15", text: "text-[#F87171]", hoverBg: "hover:bg-[#EF4444]/25" },
  info: { bg: "bg-[#3B82F6]/15", text: "text-[#60A5FA]", hoverBg: "hover:bg-[#3B82F6]/25" },
  accent: { bg: "bg-[#7C3AED]/15", text: "text-[#A78BFA]", hoverBg: "hover:bg-[#7C3AED]/25" },
  neutral: { bg: "bg-[#6B7280]/20", text: "text-[#94A3B8]", hoverBg: "hover:bg-[#6B7280]/25" },
}

const GRUPOS: Record<Exclude<StatusTone, "neutral">, string[]> = {
  success: [
    "Activo", "Aceptada", "Firmada", "Disponible", "Completada", "Completado", "Pagado",
    "Devuelto", "Resuelto", "Fijo", "Bueno", "Exitosa", "Baja", "Confirmado", "Finalizado",
    "Cerrado financiero",
  ],
  warning: [
    "Pendiente", "En proceso", "En Préstamo", "Media", "En Ejecución", "Montaje", "Desmontaje",
    "Prueba de sonido", "En Producción", "Observada", "Parcial", "En Revisión", "Por Evento",
    "Regular", "Urgente",
  ],
  danger: [
    "Cancelado", "Vencido", "Rechazada", "Mantenimiento", "Alta", "Dañado", "Abierto",
    "Fallida", "Crítica", "Inactivo",
  ],
  info: ["Enviada", "Cotización", "Planificación", "Admin", "Entrega"],
  accent: ["Operador", "Financiero", "Super Admin", "Comercial", "Devolución"],
}

const normalizar = (s: string) => s.trim().toLowerCase()

const REGISTRO = new Map<string, StatusTone>(
  (Object.keys(GRUPOS) as (keyof typeof GRUPOS)[]).flatMap((tone) =>
    GRUPOS[tone].map((estado) => [normalizar(estado), tone] as [string, StatusTone]),
  ),
)

/** Un estado desconocido es "neutral": se muestra gris en vez de romper la vista. */
export function getStatusTone(status: string): StatusTone {
  return REGISTRO.get(normalizar(status)) ?? "neutral"
}

export const getStatusClasses = (status: string): ToneClasses =>
  TONE_CLASSES[getStatusTone(status)]

/* ────────────────────────────────── Props ──────────────────────────────────
   API preferida:  value / onChange / options (string o { value, label?, tone? }).
   Se siguen aceptando currentStatus, status, onStatusChange (obsoletos). */

export interface StatusOption {
  value: string
  /** Texto visible; por defecto, el propio value. */
  label?: string
  /** Tono de color; por defecto sale del registro compartido (statusTones). */
  tone?: StatusTone
}

export interface TableStatusSelectProps {
  value?: string
  /** @deprecated usa `value` */
  currentStatus?: string
  /** @deprecated usa `value` */
  status?: string
  options: (string | StatusOption)[]
  /** Puede devolver una promesa: mientras se resuelve, el control muestra "guardando". */
  onChange?: (newStatus: string) => void | Promise<void>
  /** @deprecated usa `onChange` */
  onStatusChange?: (newStatus: string) => void | Promise<void>
  disabled?: boolean
  /** Para mostrar "guardando" desde fuera (si el guardado no pasa por onChange). */
  pending?: boolean
  /** Contexto para lectores de pantalla, p. ej. "Estado de AudioPro Colombia". */
  ariaLabel?: string
}

interface ResolvedOption {
  value: string
  label: string
  tone: StatusTone
}

const TYPEAHEAD_RESET_MS = 600

export function TableStatusSelect({
  value,
  currentStatus,
  status,
  options,
  onChange,
  onStatusChange,
  disabled = false,
  pending = false,
  ariaLabel = "Estado",
}: TableStatusSelectProps) {
  const current = value ?? currentStatus ?? status ?? ""
  const handler = onChange ?? onStatusChange

  const baseId = useId()
  const menuId = `${baseId}-menu`
  const optionId = (i: number) => `${baseId}-opt-${i}`

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; minWidth: number } | null>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const typeahead = useRef({ buffer: "", timer: 0 as unknown as ReturnType<typeof setTimeout> })

  // Las opciones conservan SU orden (antes la seleccionada saltaba al primer lugar y todo se movía).
  const items = useMemo<ResolvedOption[]>(
    () =>
      options.map((o) => {
        const opt = typeof o === "string" ? { value: o } : o
        return {
          value: opt.value,
          label: opt.label ?? opt.value,
          tone: opt.tone ?? getStatusTone(opt.value),
        }
      }),
    [options],
  )

  const selectedIndex = items.findIndex((i) => i.value === current)
  const currentItem = selectedIndex >= 0 ? items[selectedIndex] : undefined
  const currentLabel = currentItem?.label ?? (current || "Sin estado")
  const currentTone: StatusTone = currentItem?.tone ?? (current ? getStatusTone(current) : "neutral")
  const tone = TONE_CLASSES[currentTone]

  const busy = saving || pending

  /* ───────────────────────────── Posición del menú ─────────────────────────────
     El menú va en un portal sobre <body>: ya no lo recorta el overflow de la tabla.
     Se coloca debajo del botón y se invierte hacia arriba si no cabe. */
  const updatePosition = useCallback(() => {
    const t = triggerRef.current
    if (!t) return
    const r = t.getBoundingClientRect()
    const m = menuRef.current
    const mh = m?.offsetHeight ?? 0
    const mw = m?.offsetWidth ?? r.width
    const gap = 6
    let top = r.bottom + gap
    if (mh && top + mh > window.innerHeight - 8 && r.top - gap - mh > 8) {
      top = r.top - gap - mh
    }
    let left = r.left
    if (mw && left + mw > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - 8 - mw)
    }
    setPos({ top, left, minWidth: r.width })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open, updatePosition])

  // Foco al menú al abrir (la navegación con flechas ocurre ahí)
  useLayoutEffect(() => {
    if (open) menuRef.current?.focus({ preventScroll: true })
  }, [open])

  // La opción activa siempre queda visible si el menú hace scroll
  useEffect(() => {
    if (open) {
      document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex])

  // Clic/toque fuera: cierra (se considera el botón y el menú del portal)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    return () => document.removeEventListener("pointerdown", onDown)
  }, [open])

  useEffect(() => {
    const t = typeahead.current
    return () => clearTimeout(t.timer)
  }, [])

  /* ─────────────────────────────── Acciones ─────────────────────────────── */

  const openMenu = () => {
    if (busy) return
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
    setOpen(true)
  }

  // Cerrar devuelve el foco al botón (antes caía al <body> y se perdía la posición del teclado)
  const closeMenu = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const choose = async (index: number) => {
    const opt = items[index]
    closeMenu(true)
    // Elegir lo que ya está seleccionado no dispara nada
    if (!opt || opt.value === current) return
    const result = handler?.(opt.value)
    if (result && typeof (result as Promise<void>).then === "function") {
      setSaving(true)
      try {
        await result
      } finally {
        setSaving(false)
      }
    }
  }

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      openMenu()
    }
  }

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const n = items.length
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % n)
        return
      case "ArrowUp":
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + n) % n)
        return
      case "Home":
        e.preventDefault()
        setActiveIndex(0)
        return
      case "End":
        e.preventDefault()
        setActiveIndex(n - 1)
        return
      case "Enter":
      case " ":
        e.preventDefault()
        void choose(activeIndex)
        return
      case "Escape":
        // stopPropagation: si el control está dentro de un Drawer/modal, Esc cierra solo el menú
        e.preventDefault()
        e.stopPropagation()
        closeMenu(true)
        return
      case "Tab":
        // Sin preventDefault: el foco continúa al siguiente elemento después del botón
        closeMenu(true)
        return
      default:
        break
    }

    // Escribir una letra salta a la primera opción que empieza así
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const t = typeahead.current
      clearTimeout(t.timer)
      t.buffer += e.key.toLowerCase()
      t.timer = setTimeout(() => (t.buffer = ""), TYPEAHEAD_RESET_MS)
      const found = items.findIndex((it) => it.label.toLowerCase().startsWith(t.buffer))
      if (found >= 0) setActiveIndex(found)
    }
  }

  /* ───────────────────── Solo lectura (sin acción posible) ───────────────────── */

  if (disabled || !handler || items.length === 0) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded text-[11px] font-medium ${tone.bg} ${tone.text}`}
      >
        {currentLabel}
      </span>
    )
  }

  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      {/* ── Botón ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeMenu(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-disabled={busy || undefined}
        aria-busy={busy || undefined}
        aria-label={`${ariaLabel}: ${currentLabel}. ${busy ? "Guardando" : "Cambiar"}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors select-none ${tone.bg} ${tone.text} ${
          busy ? "cursor-wait opacity-80" : "cursor-pointer hover:brightness-125"
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]`}
      >
        <span>{currentLabel}</span>
        {busy ? (
          <Loader2 size={11} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
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

      {/* ── Menú flotante (fixed) ── */}
      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="listbox"
          tabIndex={-1}
          aria-label={`${ariaLabel}: seleccionar nuevo valor`}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={onMenuKeyDown}
          // opacity (no visibility) mientras se mide: un elemento invisible no puede recibir foco
          style={
            pos
              ? { top: pos.top, left: pos.left, minWidth: pos.minWidth }
              : { top: 0, left: 0, opacity: 0, pointerEvents: "none" }
          }
          className="fixed z-[60] bg-[#181B22] border border-[#2D3748] rounded-xl shadow-2xl p-1.5 space-y-1 min-w-max focus:outline-none"
        >
          {items.map((it, i) => {
            const c = TONE_CLASSES[it.tone]
            const isSelected = i === selectedIndex
            const isActive = i === activeIndex
            return (
              <div
                key={it.value}
                id={optionId(i)}
                role="option"
                aria-selected={isSelected}
                onClick={() => void choose(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex items-center justify-between gap-3 px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer ${c.bg} ${c.text} ${c.hoverBg} ${
                  isSelected ? "font-semibold" : ""
                } ${isActive ? "ring-2 ring-[#7C3AED]/70" : ""}`}
              >
                <span>{it.label}</span>
                {isSelected && (
                  <Check size={11} className="shrink-0 opacity-90" aria-hidden="true" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
