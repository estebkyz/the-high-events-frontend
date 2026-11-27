import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { Check } from "lucide-react"
import { TOAST_PALETTES, type ToastType } from "@/components/toastPalette"

type ToastPosition = "top-right" | "top-center"

interface ToastItem {
  id: number
  type: ToastType
  message: string
  position: ToastPosition
  exiting: boolean
}

type Notify = (message: string) => void
type ToastApi = Record<ToastType, Notify>

const ToastContext = createContext<ToastApi | null>(null)

const MAX_TOASTS = 3
const VISIBLE_MS = 3200
const FADE_MS = 450

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-right": "top-5 right-5",
  "top-center": "top-5 left-1/2 -translate-x-1/2",
}

/** Con un modal abierto o en Login, a la derecha para no tapar el contenido. */
function detectPosition(): ToastPosition {
  return document.querySelector('[role="dialog"], #login-email')
    ? "top-right"
    : "top-center"
}

function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] })
  return () => observer.disconnect()
}

function getTheme(): "dark" | "light" {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark"
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const show = useCallback((type: ToastType, message: string) => {
    const id = nextId.current++
    const toast = { id, type, message, position: detectPosition(), exiting: false }
    setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS))
    setTimeout(
      () =>
        setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))),
      VISIBLE_MS,
    )
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      VISIBLE_MS + FADE_MS,
    )
  }, [])

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => show("success", message),
      error: (message) => show("error", message),
      warning: (message) => show("warning", message),
      info: (message) => show("info", message),
    }),
    [show],
  )

  // El más reciente va al frente y decide la posición del grupo.
  const stack = [...toasts].reverse()
  const position = stack[0]?.position ?? "top-center"

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className={`fixed z-[120] pointer-events-none w-full max-w-[380px] px-4 sm:px-0 ${POSITION_CLASSES[position]}`}
      >
        <div className="relative w-full">
          {stack.map((toast, index) => (
            <ToastCard key={toast.id} toast={toast} index={index} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

interface ToastCardProps {
  toast: ToastItem
  index: number
}

function ToastCard({ toast, index }: ToastCardProps) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme)
  const palette = TOAST_PALETTES[theme][toast.type]
  const scale = (1 - index * 0.045) * (toast.exiting ? 0.97 : 1)
  const offset = index * 9 - (toast.exiting ? 6 : 0)

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      style={{
        backgroundColor: palette.bg,
        borderColor: palette.border,
        zIndex: 30 - index * 10,
        opacity: toast.exiting ? 0 : 1 - index * 0.08,
        transform: `translateY(${offset}px) scale(${scale})`,
        position: index === 0 ? "relative" : "absolute",
      }}
      className="inset-x-0 top-0 origin-top rounded-xl border px-4 py-3.5 flex items-center gap-3 select-none shadow-popover transition-[transform,opacity] duration-300"
    >
      <span
        aria-hidden="true"
        style={{ backgroundColor: palette.circle, color: palette.icon }}
        className="w-[19px] h-[19px] rounded-full flex items-center justify-center shrink-0 font-semibold text-xs leading-none"
      >
        {toast.type === "success" ? <Check size={12} strokeWidth={3.5} /> : "!"}
      </span>
      <p
        style={{ color: palette.text }}
        className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug"
      >
        {toast.message}
      </p>
    </div>
  )
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast debe usarse dentro de <ToastProvider>")
  return context
}
