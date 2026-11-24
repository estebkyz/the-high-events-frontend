import { DollarSign } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailHighlight,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { formatCOP } from "@/utils/format"
import { IncidenteBitacora } from "../components/IncidenteBitacora"
import { TIPO_INCIDENTE_LABELS } from "../constants"
import type { AccionForm, IncidenteItem } from "../types"

interface IncidenteDetailDrawerProps extends DetailDrawerProps<IncidenteItem> {
  saving: boolean
  onAddAccion: (incidente: IncidenteItem, form: AccionForm) => Promise<boolean>
}

export function IncidenteDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  saving,
  onAddAccion,
}: IncidenteDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de incidente"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar incidente"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.criticidad} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={item.titulo}
        subtitle={item.descripcion}
        meta={
          <span>
            {item.codigo} · {item.fecha}
          </span>
        }
      />
      <DetailHighlight
        label="Costo adicional"
        value={formatCOP(item.costo_adicional)}
        icon={DollarSign}
        tone="success"
      />
      <DetailGrid>
        <DetailField label="Evento" value={item.evento} />
        <DetailField label="Informante" value={item.reporta} />
        <DetailField
          label="Tipo"
          value={TIPO_INCIDENTE_LABELS[item.tipo_incidente] ?? item.tipo_incidente}
        />
        <DetailField label="Área afectada" value={item.areaAfectada || "No registrada"} />
      </DetailGrid>
      <IncidenteBitacora
        key={item.id}
        incidente={item}
        saving={saving}
        onAddAccion={onAddAccion}
      />
    </Drawer>
  )
}
