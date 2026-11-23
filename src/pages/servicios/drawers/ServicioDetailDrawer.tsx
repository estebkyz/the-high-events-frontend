import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
  DetailHighlight,
  DetailList,
  DetailEmptyNote,
} from "../../../components/detail"
import { Tag, DollarSign, FileText, Edit2, Clock, Truck } from "lucide-react"
import { TIPO_COBRO_LABELS, type ServicioItem } from "../types"
import { INITIAL_PROVIDERS } from "../../proveedores/data"

interface ServicioDetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  service: ServicioItem | null
  onOpenEdit: (service: ServicioItem) => void
}

export function ServicioDetailDrawer({
  isOpen,
  onClose,
  service,
  onOpenEdit,
}: ServicioDetailDrawerProps) {
  if (!service) return null

  const linkedProviders = INITIAL_PROVIDERS.filter(
    (p) =>
      p.estado === "Activo" &&
      p.servicios.some(
        (srv) =>
          srv.toLowerCase().includes(service.categoria.toLowerCase()) ||
          service.categoria.toLowerCase().includes(srv.toLowerCase()) ||
          service.nombre.toLowerCase().includes(srv.toLowerCase()),
      ),
  )

  const modalidadCobro = TIPO_COBRO_LABELS[service.tipo_cobro] || service.tipo_cobro

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de servicio"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#262D3D] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenEdit(service)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer"
          >
            <Edit2 size={13} aria-hidden="true" />
            Editar servicio
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <DetailHeader
          badges={<StatusBadge status={service.estado} />}
          title={service.nombre}
          subtitle={
            <>
              Categoría:{" "}
              <span className="text-[#A78BFA] font-semibold">
                {service.categoria}
              </span>
            </>
          }
        />

        <DetailHighlight
          label="Tarifa Base"
          value={service.precioBase}
          sublabel={modalidadCobro}
          icon={DollarSign}
          tone="success"
        />

        <DetailSection title="Información del servicio" noBorder>
          <DetailGrid>
            <DetailField
              label="Categoría"
              value={service.categoria}
              icon={Tag}
            />
            <DetailField
              label="Modalidad Cobro"
              value={modalidadCobro}
              icon={Clock}
              valueClassName="text-[#A78BFA] font-semibold"
            />
            <DetailField
              label="Descripción Técnica"
              value={service.descripcion}
              icon={FileText}
              valueClassName="font-normal text-[#CBD5E1] leading-relaxed"
              span={2}
            />
          </DetailGrid>
        </DetailSection>

        <DetailSection
          title="Proveedores Habilitados (Relación M:N)"
          icon={Truck}
          count={linkedProviders.length}
        >
          <p className="text-[11px] text-[#94A3B8]">
            Servicio del catálogo maestro: puede ejecutarse directamente por The High Events o contratarse con cualquiera de los proveedores habilitados según el evento:
          </p>
          {linkedProviders.length > 0 ? (
            <DetailList>
              {linkedProviders.map((p) => (
                <div
                  key={p.id}
                  className="py-2.5 flex items-center justify-between gap-2"
                >
                  <span className="text-[12px] font-medium text-[#F1F5F9] truncate">
                    {p.razon_social}
                  </span>
                  <span className="text-[10px] text-[#A78BFA] shrink-0">
                    Habilitado
                  </span>
                </div>
              ))}
            </DetailList>
          ) : (
            <DetailEmptyNote text="Ejecución directa por The High Events (sin terceros asociados actualmente)." />
          )}
        </DetailSection>
      </div>
    </Drawer>
  )
}
