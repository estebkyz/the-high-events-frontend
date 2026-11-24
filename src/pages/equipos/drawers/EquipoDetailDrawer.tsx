import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailSection,
  DetailStatusPicker,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { formatCOP } from "@/utils/format"
import { CategoryIcon } from "../components/CategoryIcon"
import { ESTADOS_OPERATIVOS } from "../constants"
import type { EquipoItem, EstadoOperativo } from "../types"

interface EquipoDetailDrawerProps extends DetailDrawerProps<EquipoItem> {
  onStatusChange: (id: string, estado: EstadoOperativo) => unknown
}

export function EquipoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
}: EquipoDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de equipo"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar equipo"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.estadoOperativo} />
            <StatusBadge status={item.propiedad} />
          </>
        }
        title={
          <span className="inline-flex items-center gap-2.5">
            <CategoryIcon categoria={item.categoria} size={18} />
            {item.nombre}
          </span>
        }
        subtitle={`Serie: ${item.serie}`}
      />
      <DetailGrid>
        <DetailField label="Categoría" value={item.categoria} />
        <DetailField
          label="Proveedor"
          value={
            item.propiedad === "Alquilado"
              ? item.proveedor_nombre || "Proveedor externo"
              : "Ninguno (equipo propio)"
          }
        />
        {item.costo_adquisicion && (
          <DetailField
            label="Costo de adquisición"
            value={formatCOP(item.costo_adquisicion)}
            valueClassName="text-[#10B981] tabular-nums"
          />
        )}
        {item.costo_alquiler_dia && (
          <DetailField
            label="Costo de alquiler por día"
            value={formatCOP(item.costo_alquiler_dia)}
            valueClassName="text-[#10B981] tabular-nums"
          />
        )}
        {item.mantenimiento_proximo && (
          <DetailField label="Próximo mantenimiento" value={item.mantenimiento_proximo} />
        )}
      </DetailGrid>
      <DetailSection title="Estado operativo">
        <DetailStatusPicker
          value={item.estadoOperativo}
          options={ESTADOS_OPERATIVOS}
          onChange={(estado) => onStatusChange(item.id, estado)}
        />
      </DetailSection>
    </Drawer>
  )
}
