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
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import type { EmpleadoItem } from "../types"
import { getEmpleadoFullName } from "../utils"

interface EmpleadoDetailDrawerProps extends DetailDrawerProps<EmpleadoItem> {
  onStatusChange: (id: string, estado: EstadoActivo) => unknown
}

export function EmpleadoDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
}: EmpleadoDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de empleado"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar empleado"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.vinculacion ?? "Fijo"} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={getEmpleadoFullName(item)}
        subtitle={item.cargo}
      />
      <DetailGrid>
        <DetailField
          label="Documento"
          value={`${item.tipo_documento} ${item.numero_documento}`}
        />
        <DetailField
          label="Teléfono"
          value={item.telefono}
          valueClassName="tabular-nums"
        />
        <DetailField
          label="Correo electrónico"
          value={item.correo}
          span={2}
          valueClassName="break-all"
        />
      </DetailGrid>

      <DetailSection title="Estado">
        <DetailStatusPicker
          value={item.estado}
          options={ESTADOS_ACTIVO}
          onChange={(estado) => onStatusChange(item.id, estado)}
        />
      </DetailSection>
    </Drawer>
  )
}
