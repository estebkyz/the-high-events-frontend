import { ArrowLeftCircle, Camera, CheckCircle2, PackageCheck } from "lucide-react"
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
import { esDefinitiva, getOrigen } from "../form"
import type { Recepcion } from "../types"
import { MODULE_ACCESS } from "@/constants/access"

interface RecepcionDetailDrawerProps extends DetailDrawerProps<Recepcion> {
  /** Aún falta registrar su devolución. */
  admiteDevolucion: boolean
  onConfirmar: (recepcion: Recepcion) => void
  onDevolucion: (recepcion: Recepcion) => void
}

export function RecepcionDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  admiteDevolucion,
  onConfirmar,
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
          onEdit={esDefinitiva(item) ? undefined : () => onEdit(item)}
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
        <DetailField label="Origen" value={getOrigen(item)} />
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
                  <span className="font-semibold text-ink">
                    {equipo.nombre}{" "}
                    <span className="font-normal text-ink-muted">×{equipo.cantidad}</span>
                  </span>
                  <StatusBadge status={equipo.estado} />
                </div>
                <p className="text-xs text-ink-muted">
                  {equipo.observaciones || "Sin novedad física"}
                </p>
                {equipo.evidencia_foto && (
                  <a
                    href={equipo.evidencia_foto}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-ink hover:underline"
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

      {item.estado === "Pendiente" && (
        <DetailSection title={item.automatico ? "Borrador del evento" : "Verificación"}>
          <p className="text-xs text-ink-muted pb-2">
            Si hubo novedades, edita el estado de cada equipo antes de confirmar.
          </p>
          <DetailAction
            icon={CheckCircle2}
            label="Confirmar como conforme"
            tone="success"
            onClick={() => onConfirmar(item)}
            needs={MODULE_ACCESS.recepciones.status}
          />
        </DetailSection>
      )}
      {admiteDevolucion && (
        <DetailAction
          icon={ArrowLeftCircle}
          label={item.proveedor ? "Registrar devolución" : "Registrar regreso a bodega"}
          tone="accent"
          onClick={() => onDevolucion(item)}
          needs={MODULE_ACCESS.recepciones.create}
        />
      )}
    </Drawer>
  )
}
