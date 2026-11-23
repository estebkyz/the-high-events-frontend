import React from "react"
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
import type { ClienteItem, HistorialItem } from "../types"
import { getClienteDisplayName } from "../utils"

interface ClienteDetailDrawerProps {
  isOpen: boolean; client: ClienteItem | null
  historial: HistorialItem[]
  onClose: () => void
  onSetEstado: (id: string, estado: string) => void
  onOpenEdit: (client: ClienteItem) => void
}

export const ClienteDetailDrawer: React.FC<ClienteDetailDrawerProps> = ({
  isOpen,
  client,
  historial,
  onClose,
  onSetEstado,
  onOpenEdit,
}) => {
  if (!client) return null

  const displayName = getClienteDisplayName(client)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de cliente"
      subtitle={displayName}
      footer={
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenEdit(client)
            }}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            Editar cliente
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={
            <>
              <StatusBadge status={client.tipo_cliente} />
              <StatusBadge status={client.estado} />
            </>
          }
          title={displayName}
          subtitle={
            client.tipo_cliente === "Empresa" && client.contacto_nombre
              ? client.contacto_nombre
              : undefined
          }
        />

        <DetailGrid>
          <DetailField
            label="Documento"
            value={`${client.tipo_documento} ${client.numero_documento}`}
          />
          <DetailField
            label="Dirección"
            value={client.direccion || "No registrada"}
          />
          <DetailField
            label="Correo electrónico"
            value={client.correo || "No registrado"}
            valueClassName="break-all"
          />
          <DetailField
            label="Teléfono"
            value={client.telefono || "No registrado"}
          />
        </DetailGrid>

        <DetailSection title="Estado de cliente">
          <div className="flex gap-2">
            {["Activo", "Inactivo"].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={client.estado === s}
                onClick={() => onSetEstado(client.id, s)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors border cursor-pointer ${
                  client.estado === s
                    ? s === "Activo"
                      ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                      : "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40"
                    : "bg-[#2D3748] text-[#94A3B8] border-[#2D3748] hover:bg-[#374151]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </DetailSection>

        <DetailSection
          title="Historial comercial"
          count={historial.length > 0 ? `${historial.length} registro(s)` : undefined}
        >
          {historial.length === 0 ? (
            <DetailEmptyNote text="Sin historial comercial" />
          ) : (
            <DetailList>
              {historial.map((h, i) => (
                <div
                  key={i}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#A78BFA]">
                        {h.referencia}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">{h.tipo}</span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{h.fecha}</p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-semibold text-[#F1F5F9] tabular-nums">
                      {h.monto}
                    </span>
                    <StatusBadge status={h.estado} />
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
