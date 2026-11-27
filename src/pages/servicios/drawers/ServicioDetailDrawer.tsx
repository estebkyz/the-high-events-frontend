import { Clock, DollarSign, FileText, Tag, Truck } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailHighlight,
  DetailList,
  DetailSection,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import type { ProveedorItem } from "@/pages/proveedores/types"
import { TIPO_COBRO_LABELS } from "../constants"
import type { ServicioItem } from "../types"
import { EMPRESA } from "@/constants/empresa"

interface ServicioDetailDrawerProps extends DetailDrawerProps<ServicioItem> {
  /** Proveedores activos que ofrecen este servicio. */
  proveedores: ProveedorItem[]
}

export function ServicioDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  proveedores,
}: ServicioDetailDrawerProps) {
  if (!item) return null
  const modalidad = TIPO_COBRO_LABELS[item.tipo_cobro] ?? item.tipo_cobro

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de servicio"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar servicio"
        />
      }
    >
      <DetailHeader badges={<StatusBadge status={item.estado} />} title={item.nombre} />
      <DetailHighlight
        label="Precio base"
        value={item.precioBase}
        sublabel={modalidad}
        icon={DollarSign}
        tone="accent"
      />
      <DetailGrid>
        <DetailField label="Categoría" value={item.categoria} icon={Tag} />
        <DetailField label="Modalidad de cobro" value={modalidad} icon={Clock} />
        <DetailField
          label="Descripción técnica"
          value={item.descripcion}
          icon={FileText}
          span={2}
        />
      </DetailGrid>
      <DetailSection
        title="Proveedores habilitados"
        icon={Truck}
        count={proveedores.length}
      >
        {proveedores.length === 0 ? (
          <DetailEmptyNote text={`Ejecución directa por ${EMPRESA.nombre}.`} />
        ) : (
          <DetailList>
            {proveedores.map((p) => (
              <p key={p.id} className="py-2.5 text-xs font-medium text-ink">
                {p.razon_social}
              </p>
            ))}
          </DetailList>
        )}
      </DetailSection>
    </Drawer>
  )
}
