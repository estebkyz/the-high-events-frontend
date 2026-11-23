import type { SelectOption } from "../../components/CustomSelect"
import type { Recepcion } from "./types"

export const INITIAL_RECEPCIONES: Recepcion[] = []

export const EVENTOS_DISPONIBLES: SelectOption[] = []

export const TIPOS_OPTIONS: SelectOption[] = [
  { label: "Recepción Montaje", value: "Recepción Montaje" },
  { label: "Recepción Desmontaje", value: "Recepción Desmontaje" },
]

export const ESTADOS_OPTIONS: SelectOption[] = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "Conforme", value: "Conforme" },
  { label: "Cerrada", value: "Cerrada" },
  { label: "Anulada", value: "Anulada" },
]

export const ESTADO_ITEM_COLORS: Record<string, string> = {
  Excelente: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30",
  Bueno: "text-[#3B82F6] bg-[#3B82F6]/10 border-[#3B82F6]/30",
  Regular: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30",
  Dañado: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30",
}
