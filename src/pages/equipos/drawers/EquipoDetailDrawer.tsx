import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { CustomSelect } from "../../../components/CustomSelect"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailList,
  DetailEmptyNote,
} from "../../../components/detail"
import { getCategoryIcon } from "../components/CategoryIcon"
import { MAINTENANCE_HISTORY, ESTADO_OPERATIVO_OPTIONS } from "../data"
import type { EquipoItem, EstadoOperativo } from "../types"

interface EquipoDetailDrawerProps {
  isOpen: boolean; onClose: () => void
  equipo: EquipoItem | null
  selectedEstado: EstadoOperativo
  setSelectedEstado: (estado: EstadoOperativo) => void
  onApplyEstado: (id: string, estado: EstadoOperativo) => void
}

const ESTADO_SELECT_OPTIONS = ESTADO_OPERATIVO_OPTIONS.map((e) => ({
  value: e,
  label: e,
}))

export function EquipoDetailDrawer({
  isOpen,
  onClose,
  equipo,
  selectedEstado,
  setSelectedEstado,
  onApplyEstado,
}: EquipoDetailDrawerProps) {
  if (!equipo) return null

  const history = MAINTENANCE_HISTORY[equipo.id] ?? []

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de Equipo"
      subtitle={equipo.serie}
      footer={
        <button
          type="button"
          onClick={() => {
            onApplyEstado(equipo.id, selectedEstado)
            onClose()
          }}
          className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
        >
          Aplicar Cambio
        </button>
      }
    >
      <div className="space-y-4 text-xs">
        <DetailHeader
          badges={
            <>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#7C3AED]/15 text-[#A78BFA] border border-[#7C3AED]/30">
                {equipo.categoria}
              </span>
              <StatusBadge status={equipo.estadoOperativo} />
              <StatusBadge status={equipo.propiedad} />
            </>
          }
          title={
            <span className="inline-flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-lg bg-[#242830] flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {getCategoryIcon(equipo.categoria, 18)}
              </span>
              <span>{equipo.nombre}</span>
            </span>
          }
          subtitle={`Serie: ${equipo.serie}`}
        />

        <DetailSection title="Especificaciones y propiedad" noBorder>
          <DetailGrid>
            <DetailField label="Proveedor Asociado (id_proveedor)" span={2}>
              {equipo.propiedad === "Alquilado" ? (
                <div>
                  <span className="font-semibold text-[#F1F5F9] text-[13px]">
                    {equipo.proveedor_nombre || "Proveedor externo"}
                  </span>
                  <p className="text-[11px] text-[#60A5FA] mt-1 font-normal">
                    Aplica Formato Digital de Entrega y Recepción con evidencias fotográficas (montaje y desmontaje).
                  </p>
                </div>
              ) : (
                <span className="font-medium text-[#94A3B8] text-[12px]">
                  Ninguno (id_proveedor = NULL · Activo Propio de The High Events)
                </span>
              )}
            </DetailField>

            {equipo.costo_adquisicion ? (
              <DetailField
                label="Costo Adquisición"
                value={equipo.costo_adquisicion.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                })}
                valueClassName="font-semibold text-[#10B981] tabular-nums"
              />
            ) : null}

            {equipo.costo_alquiler_dia ? (
              <DetailField
                label="Costo Alquiler / Día"
                value={equipo.costo_alquiler_dia.toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                })}
                valueClassName="font-semibold text-[#F59E0B] tabular-nums"
              />
            ) : null}

            {equipo.mantenimiento_proximo ? (
              <DetailField
                label="Próximo Mantenimiento Programado"
                value={equipo.mantenimiento_proximo}
                span={2}
              />
            ) : null}
          </DetailGrid>
        </DetailSection>

        <DetailSection title="Historial de Mantenimiento" count={history.length}>
          {history.length === 0 ? (
            <DetailEmptyNote text="Sin historial registrado." />
          ) : (
            <DetailList>
              {history.map((entry, i) => (
                <div key={i} className="py-2.5 flex items-start gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full bg-[#7C3AED] mt-1.5 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="font-medium text-[#F1F5F9] text-[12px]">
                      {entry.descripcion}
                    </p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {entry.fecha} · {entry.tecnico}
                    </p>
                  </div>
                </div>
              ))}
            </DetailList>
          )}
        </DetailSection>

        <DetailSection title="Cambiar Estado Operativo">
          <CustomSelect
            value={selectedEstado}
            onChange={(val) => setSelectedEstado(val as EstadoOperativo)}
            options={ESTADO_SELECT_OPTIONS}
          />
        </DetailSection>
      </div>
    </Drawer>
  )
}
