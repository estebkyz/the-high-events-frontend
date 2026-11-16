import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Perfil de Cliente"
      subtitle={getClienteDisplayName(client)}
    >
      <div className="space-y-4">
        {/* Customer header */}
        <div className="flex items-center gap-3.5 p-3.5 bg-[#1A1D23] rounded-xl border border-[#2D3748]">
          <div className="w-11 h-11 rounded-xl bg-[#7C3AED]/20 text-[#A78BFA] flex items-center justify-center font-bold text-base shrink-0 border border-[#7C3AED]/30">
            {getClienteDisplayName(client).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-[#F1F5F9] leading-snug truncate">
              {getClienteDisplayName(client)}
            </p>
            {client.tipo_cliente === "Empresa" && client.contacto_nombre && (
              <p className="text-[12px] text-[#A78BFA] font-medium mt-0.5">
                {client.contacto_nombre}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={client.tipo_cliente} />
              <StatusBadge status={client.estado} />
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Documento Legal",
              value: `${client.tipo_documento} ${client.numero_documento}`,
            },
            {
              label: "Ciudad / Dirección",
              value: `${client.ciudad} ${
                client.direccion ? `— ${client.direccion}` : ""
              }`,
            },
            { label: "Correo Electrónico", value: client.correo },
            { label: "Teléfono", value: client.telefono },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 bg-[#1A1D23] rounded-xl border border-[#2D3748]"
            >
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">
                {item.label}
              </p>
              <p className="text-xs text-[#F1F5F9] font-medium mt-1 break-all">
                {item.value || "No registrado"}
              </p>
            </div>
          ))}
        </div>

        {/* Change status */}
        <div className="p-3 bg-[#1A1D23] rounded-xl border border-[#2D3748] space-y-2">
          <p className="text-[10px] text-[#A78BFA] uppercase tracking-wider font-semibold">
            Estado del Cliente
          </p>
          <div className="flex gap-2">
            {["Activo", "Inactivo"].map((s) => (
              <button
                key={s}
                type="button"
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
        </div>

        {/* Historial Comercial */}
        <div>
          <p className="text-[11px] text-[#A78BFA] uppercase tracking-wider font-semibold mb-2">
            Historial Comercial
          </p>
          <div className="rounded-xl border border-[#2D3748] overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#111318] text-[#94A3B8]">
                  <th className="p-2.5 text-left font-medium">Referencia</th>
                  <th className="p-2.5 text-left font-medium">Tipo</th>
                  <th className="p-2.5 text-left font-medium">Fecha</th>
                  <th className="p-2.5 text-left font-medium">Monto</th>
                  <th className="p-2.5 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[#64748B]">
                      Sin historial comercial
                    </td>
                  </tr>
                ) : (
                  historial.map((h, i) => (
                    <tr
                      key={i}
                      className="border-t border-[#2D3748]/60 bg-[#1A1D23] hover:bg-[#242830] transition-colors"
                    >
                      <td className="p-2.5 font-mono text-[#A78BFA] font-semibold">
                        {h.referencia}
                      </td>
                      <td className="p-2.5 text-[#94A3B8]">{h.tipo}</td>
                      <td className="p-2.5 text-[#94A3B8]">{h.fecha}</td>
                      <td className="p-2.5 text-[#F1F5F9] font-medium">
                        {h.monto}
                      </td>
                      <td className="p-2.5">
                        <StatusBadge status={h.estado} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenEdit(client)
            }}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            Editar Cliente
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Drawer>
  )
}
