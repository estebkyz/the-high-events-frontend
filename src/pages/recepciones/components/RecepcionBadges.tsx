import React from "react"
import type { TipoRecepcion } from "../types"
import { ESTADO_ITEM_COLORS } from "../data"

export function TipoBadge({ tipo }: { tipo: TipoRecepcion }) {
  const styles =
    tipo === "Recepción Montaje"
      ? "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30"
      : "bg-[#06B6D4]/15 text-[#22D3EE] border-[#06B6D4]/30"

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium border ${styles}`}
    >
      {tipo}
    </span>
  )
}

export function ItemEstadoBadge({ estado }: { estado: string }) {
  const cls =
    ESTADO_ITEM_COLORS[estado] ?? "text-[#94A3B8] bg-[#2D3748] border-[#2D3748]"

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${cls}`}
    >
      {estado}
    </span>
  )
}
