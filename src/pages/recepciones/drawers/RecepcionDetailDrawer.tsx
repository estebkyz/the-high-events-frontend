import React from "react"
import { Camera, ArrowLeftCircle, PackageCheck } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailList,
  DetailEmptyNote,
} from "../../../components/detail"
import { TipoBadge, ItemEstadoBadge } from "../components/RecepcionBadges"
import type { Recepcion } from "../types"

interface RecepcionDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  recepcion: Recepcion | null
  onOpenDevolucion: (parent: Recepcion) => void
}

export function RecepcionDetailDrawer({
  isOpen,
  onClose,
  recepcion,
  onOpenDevolucion,
}: RecepcionDetailDrawerProps) {
  if (!recepcion) return null

  const canRegisterDevolucion =
    (recepcion.estado === "Conforme" || recepcion.estado === "Cerrada") &&
    recepcion.tipo === "Recepción Montaje"

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={`Detalle de recepción — ${recepcion.codigo}`}
      subtitle={`${recepcion.evento} · Proveedor: ${recepcion.proveedor}`}
      footer={
        canRegisterDevolucion ? (
          <button
            type="button"
            onClick={() => {
              onClose()
              setTimeout(() => onOpenDevolucion(recepcion), 80)
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7C3AED]/15 border border-[#7C3AED]/40 text-[#C4B5FD] rounded-xl text-xs font-semibold hover:bg-[#7C3AED]/25 transition-colors cursor-pointer"
          >
            <ArrowLeftCircle size={15} aria-hidden="true" />
            <span>Registrar Devolución en Desmontaje</span>
          </button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={
            <>
              <TipoBadge tipo={recepcion.tipo} />
              <StatusBadge status={recepcion.estado} />
              {recepcion.parentCodigo && (
                <span className="text-[11px] text-[#94A3B8] bg-[#14171D] border border-[#2D3748] px-2 py-0.5 rounded">
                  Ref: {recepcion.parentCodigo}
                </span>
              )}
            </>
          }
          title={recepcion.codigo}
          subtitle={`${recepcion.evento} · ${recepcion.proveedor}`}
          meta={<span>Fecha de verificación: {recepcion.fecha}</span>}
        />

        <DetailSection title="Datos de Recepción" noBorder>
          <DetailGrid>
            <DetailField
              label="Evento Asociado (FK id_evento)"
              value={recepcion.evento}
            />
            <DetailField
              label="Proveedor (FK id_proveedor)"
              value={recepcion.proveedor}
            />
            <DetailField
              label="Fecha de Verificación"
              value={recepcion.fecha}
            />
          </DetailGrid>
        </DetailSection>

        <DetailSection
          title="Detalle por Equipo Recibido (Tabla detalle_recepcion)"
          icon={PackageCheck}
          count={recepcion.items.length}
        >
          {recepcion.items.length === 0 ? (
            <DetailEmptyNote text="No se registraron equipos en esta recepción." />
          ) : (
            <DetailList>
              {recepcion.items.map((item, i) => (
                <div
                  key={`${item.nombre}-${i}`}
                  className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#F8FAFC]">
                        {item.nombre}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] tabular-nums">
                        Cant. {item.cantidad}
                      </span>
                      <ItemEstadoBadge estado={item.estado} />
                    </div>
                    <p className="text-[#CBD5E1] text-[11.5px]">
                      {item.observaciones || (
                        <span className="text-[#64748B] italic">
                          Sin novedad física
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-[#7C3AED]/15 text-[#C4B5FD] border border-[#7C3AED]/30">
                      <Camera size={11} aria-hidden="true" />
                      <span className="truncate max-w-[140px]">
                        {item.evidencia_foto || `evidencia_eq_${i + 1}.jpg`}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </DetailList>
          )}
        </DetailSection>
      </div>
    </Drawer>
  )
}
