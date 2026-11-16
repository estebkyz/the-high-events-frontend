import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { Check } from "lucide-react"

export type ToastType = "success" | "error" | "warning" | "info"
export type ToastPosition = "top-right" | "top-center"

export interface ToastItem {
  id: string; type: ToastType
  message: string
  description?: string
  position: ToastPosition
  exiting?: boolean
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, description?: string) => void
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const MAX_TOASTS = 3
const VISIBLE_DURATION_MS = 3200
const FADE_DURATION_MS = 450

function detectToastPosition(): ToastPosition {
  if (typeof document === "undefined") return "top-center"
  const isLoginScreen = Boolean(document.getElementById("login-email"))
  const isModalOpen =
    Boolean(document.querySelector('[role="dialog"]')) ||
    document.body.style.overflow === "hidden"

  return isLoginScreen || isModalOpen ? "top-right" : "top-center"
}

const TOAST_PALETTE_DARK: Record<ToastType, {
  bg: string; border: string
  circleBg: string
  iconFg: string
  text: string
  descText: string
  shadow: string
  symbol: "check" | "exclamation" | "info"
}> = {
  success: {
    bg: "#07261B",
    border: "#114A35",
    circleBg: "#34D399",
    iconFg: "#07261B",
    text: "#6EE7B7",
    descText: "#A7F3D0",
    shadow: "0 14px 30px -6px rgba(4, 24, 17, 0.7)",
    symbol: "check",
  },
  error: {
    bg: "#2A0709",
    border: "#4C1116",
    circleBg: "#FF8585",
    iconFg: "#2A0709",
    text: "#FF8A8A",
    descText: "#FCA5A5",
    shadow: "0 14px 30px -6px rgba(32, 4, 7, 0.75)",
    symbol: "exclamation",
  },
  warning: {
    bg: "#2A0709",
    border: "#4C1116",
    circleBg: "#FF8585",
    iconFg: "#2A0709",
    text: "#FF8A8A",
    descText: "#FCA5A5",
    shadow: "0 14px 30px -6px rgba(32, 4, 7, 0.75)",
    symbol: "exclamation",
  },
  info: {
    bg: "#2B1905",
    border: "#54330C",
    circleBg: "#FBBF24",
    iconFg: "#2B1905",
    text: "#FCD34D",
    descText: "#FDE68A",
    shadow: "0 14px 30px -6px rgba(33, 18, 3, 0.75)",
    symbol: "exclamation",
  },
}

const TOAST_PALETTE_LIGHT: Record<ToastType, {
  bg: string; border: string
  circleBg: string
  iconFg: string
  text: string
  descText: string
  shadow: string
  symbol: "check" | "exclamation" | "info"
}> = {
  success: {
    bg: "#FFFFFF",
    border: "#A7F3D0",
    circleBg: "#059669",
    iconFg: "#FFFFFF",
    text: "#065F46",
    descText: "#047857",
    shadow: "0 10px 25px -5px rgba(5, 150, 105, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    symbol: "check",
  },
  error: {
    bg: "#FFFFFF",
    border: "#FECACA",
    circleBg: "#DC2626",
    iconFg: "#FFFFFF",
    text: "#991B1B",
    descText: "#B91C1C",
    shadow: "0 10px 25px -5px rgba(220, 38, 38, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    symbol: "exclamation",
  },
  warning: {
    bg: "#FFFFFF",
    border: "#FDE68A",
    circleBg: "#D97706",
    iconFg: "#FFFFFF",
    text: "#92400E",
    descText: "#B45309",
    shadow: "0 10px 25px -5px rgba(217, 119, 6, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    symbol: "exclamation",
  },
  info: {
    bg: "#FFFFFF",
    border: "#BFDBFE",
    circleBg: "#2563EB",
    iconFg: "#FFFFFF",
    text: "#1E40AF",
    descText: "#1D4ED8",
    shadow: "0 10px 25px -5px rgba(37, 99, 235, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    symbol: "exclamation",
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof document === "undefined") return false
    return document.documentElement.getAttribute("data-theme") === "light"
  })

  useEffect(() => {
    const updateTheme = () => {
      setIsLightMode(document.documentElement.getAttribute("data-theme") === "light")
    }
    window.addEventListener("themechange", updateTheme)
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    })
    return () => {
      window.removeEventListener("themechange", updateTheme)
      observer.disconnect()
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const markExiting = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    )
  }, [])

  const showToast = useCallback(
    (message: string, type: ToastType = "success", description?: string) => {
      const id = String(Date.now() + Math.random())
      const position = detectToastPosition()

      setToasts((prev) => {
        const next = [
          ...prev,
          { id, type, message, description, position, exiting: false },
        ]
        // Regla estricta: máximo 3 notificaciones acumuladas
        if (next.length > MAX_TOASTS) {
          return next.slice(next.length - MAX_TOASTS)
        }
        return next
      })

      // Iniciar desvanecimiento suave antes de remover del DOM
      setTimeout(() => {
        markExiting(id)
      }, VISIBLE_DURATION_MS)

      setTimeout(() => {
        removeToast(id)
      }, VISIBLE_DURATION_MS + FADE_DURATION_MS)
    },
    [markExiting, removeToast],
  )

  const success = useCallback(
    (msg: string, desc?: string) => showToast(msg, "success", desc),
    [showToast],
  )
  const error = useCallback(
    (msg: string, desc?: string) => showToast(msg, "error", desc),
    [showToast],
  )
  const warning = useCallback(
    (msg: string, desc?: string) => showToast(msg, "warning", desc),
    [showToast],
  )
  const info = useCallback(
    (msg: string, desc?: string) => showToast(msg, "info", desc),
    [showToast],
  )

  // Determinar la posición activa según la notificación más reciente
  const activePosition: ToastPosition =
    toasts.length > 0 ? toasts[toasts.length - 1].position : "top-center"

  const containerPositionClasses =
    activePosition === "top-right"
      ? "top-5 right-5 items-end"
      : "top-5 left-1/2 -translate-x-1/2 items-center"

  // Ordenar desde la más reciente (frente, index 0) hasta las anteriores (detrás, index 1 y 2)
  const stackedToasts = [...toasts].reverse()

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* ── Contenedor de Notificaciones Apiladas (Máx 3) ── */}
      {stackedToasts.length > 0 && (
        <div
          aria-live="polite"
          className={`fixed z-[120] pointer-events-none w-full max-w-[380px] px-4 sm:px-0 flex flex-col ${containerPositionClasses}`}
        >
          <div className="relative w-full">
            {stackedToasts.map((toast, stackIndex) => {
              const palette = (
                isLightMode ? TOAST_PALETTE_LIGHT : TOAST_PALETTE_DARK
              )[toast.type]
              // Efecto de apilado
              const offsetY = stackIndex * 9
              const scale = 1 - stackIndex * 0.045
              const zIndex = 30 - stackIndex * 10
              const stackOpacity = toast.exiting ? 0 : 1 - stackIndex * 0.08

              return (
                <div
                  key={toast.id}
                  role="alert"
                  style={{
                    backgroundColor: palette.bg,
                    borderColor: palette.border,
                    boxShadow: palette.shadow,
                    zIndex,
                    opacity: stackOpacity,
                    transform: toast.exiting
                      ? `translateY(${offsetY - 6}px) scale(${scale * 0.97})`
                      : `translateY(${offsetY}px) scale(${scale})`,
                    transformOrigin: "top center",
                    transition:
                      "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms ease",
                    position: stackIndex === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                  className="pointer-events-auto w-full rounded-[11px] border px-4 py-3.5 flex items-center gap-3 select-none animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {/* Ícono circular sólido a la izquierda */}
                  <span
                    style={{
                      backgroundColor: palette.circleBg,
                      color: palette.iconFg,
                    }}
                    className="w-[19px] h-[19px] rounded-full flex items-center justify-center shrink-0 font-black text-[12px] leading-none"
                    aria-hidden="true"
                  >
                    {palette.symbol === "check" ? (
                      <Check size={12} strokeWidth={3.5} />
                    ) : (
                      <span className="font-extrabold text-[12px] leading-none">
                        !
                      </span>
                    )}
                  </span>

                  {/* Contenido del mensaje (sin botón X, se desvanece solo) */}
                  <div className="min-w-0 flex-1">
                    <p
                      style={{ color: palette.text }}
                      className="text-[13.5px] font-semibold leading-snug tracking-[-0.01em]"
                    >
                      {toast.message}
                    </p>
                    {toast.description && (
                      <p
                        style={{ color: palette.descText }}
                        className="text-[11.5px] font-medium mt-0.5 leading-normal opacity-90"
                      >
                        {toast.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast debe ser utilizado dentro de un ToastProvider")
  }
  return context
}
