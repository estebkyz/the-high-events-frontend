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
import type { ClienteItem } from "../types"
import { getClienteName } from "../utils"

interface ClienteDetailDrawerProps extends DetailDrawerProps<ClienteItem> {
  onStatusChange: (id: string, estado: EstadoActivo) => unknown
}

export function ClienteDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
}: ClienteDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de cliente"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar cliente"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.tipo_cliente} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={getClienteName(item)}
        subtitle={item.tipo_cliente === "Empresa" ? item.contacto_nombre : undefined}
      />
      <DetailGrid>
        <DetailField
          label="Documento"
          value={`${item.tipo_documento} ${item.numero_documento}`}
        />
        <DetailField label="Teléfono" value={item.telefono || "No registrado"} />
        <DetailField
          label="Correo electrónico"
          value={item.correo || "No registrado"}
          valueClassName="break-all"
        />
        <DetailField label="Dirección" value={item.direccion || "No registrada"} />
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
