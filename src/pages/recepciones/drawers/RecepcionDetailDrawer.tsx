import { ArrowLeftCircle, Camera, PackageCheck } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailAction,
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailList,
  DetailSection,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { admiteDevolucion } from "../form"
import type { Recepcion } from "../types"

interface RecepcionDetailDrawerProps extends DetailDrawerProps<Recepcion> {
  onDevolucion: (recepcion: Recepcion) => void
}

export function RecepcionDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onDevolucion,
}: RecepcionDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de recepción"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar recepción"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.tipo} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={item.codigo}
        subtitle={item.parentCodigo && `Referencia: ${item.parentCodigo}`}
      />
      <DetailGrid>
        <DetailField label="Evento" value={item.evento} />
        <DetailField label="Proveedor" value={item.proveedor} />
        <DetailField label="Responsable" value={item.responsable} />
        <DetailField label="Fecha de verificación" value={item.fecha} />
        {item.observaciones && (
          <DetailField label="Observaciones" value={item.observaciones} span={2} />
        )}
      </DetailGrid>

      <DetailSection
        title="Equipos recibidos"
        icon={PackageCheck}
        count={item.items.length}
      >
        {item.items.length === 0 ? (
          <DetailEmptyNote text="No se registraron equipos en esta recepción." />
        ) : (
          <DetailList>
            {item.items.map((equipo, index) => (
              <div key={`${equipo.nombre}-${index}`} className="py-2.5 space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[#F8FAFC]">
                    {equipo.nombre}{" "}
                    <span className="font-normal text-[#94A3B8]">×{equipo.cantidad}</span>
                  </span>
                  <StatusBadge status={equipo.estado} />
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  {equipo.observaciones || "Sin novedad física"}
                </p>
                {equipo.evidencia_foto && (
                  <a
                    href={equipo.evidencia_foto}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#A78BFA] hover:underline"
                  >
                    <Camera size={11} aria-hidden="true" />
                    Ver evidencia
                  </a>
                )}
              </div>
            ))}
          </DetailList>
        )}
      </DetailSection>

      {admiteDevolucion(item) && (
        <DetailAction
          icon={ArrowLeftCircle}
          label="Registrar devolución"
          tone="accent"
          onClick={() => onDevolucion(item)}
        />
      )}
    </Drawer>
  )
}
