export type ToastType = "success" | "error" | "warning" | "info"

interface ToastPalette {
  bg: string
  border: string
  circle: string
  icon: string
  text: string
}

const RED_DARK: ToastPalette = {
  bg: "#2A0709",
  border: "#4C1116",
  circle: "#FF8585",
  icon: "#2A0709",
  text: "#FF8A8A",
}

/** Verde = éxito · rojo = error o advertencia · ámbar = información. */
export const TOAST_PALETTES: Record<"dark" | "light", Record<ToastType, ToastPalette>> = {
  dark: {
    success: {
      bg: "#07261B",
      border: "#114A35",
      circle: "#34D399",
      icon: "#07261B",
      text: "#6EE7B7",
    },
    error: RED_DARK,
    warning: RED_DARK,
    info: {
      bg: "#2B1905",
      border: "#54330C",
      circle: "#FBBF24",
      icon: "#2B1905",
      text: "#FCD34D",
    },
  },
  light: {
    success: {
      bg: "#FFFFFF",
      border: "#A7F3D0",
      circle: "#059669",
      icon: "#FFFFFF",
      text: "#065F46",
    },
    error: {
      bg: "#FFFFFF",
      border: "#FECACA",
      circle: "#DC2626",
      icon: "#FFFFFF",
      text: "#991B1B",
    },
    warning: {
      bg: "#FFFFFF",
      border: "#FECACA",
      circle: "#DC2626",
      icon: "#FFFFFF",
      text: "#991B1B",
    },
    info: {
      bg: "#FFFFFF",
      border: "#FDE68A",
      circle: "#D97706",
      icon: "#FFFFFF",
      text: "#92400E",
    },
  },
}
