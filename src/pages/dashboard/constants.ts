import type { SegmentedOption } from "@/components/SegmentedControl"

export const RANGE_OPTIONS: SegmentedOption[] = [
  { value: "dia", label: "Día" },
  { value: "semana", label: "Semana" },
  { value: "mes", label: "Mes" },
  { value: "anio", label: "Año" },
]

export const COLORS = {
  accent: "#7C3AED",
  success: "#10B981",
  info: "#3B82F6",
} as const

export const PANEL = "bg-[#181B22] border border-[#262D3D] rounded-2xl p-5"
