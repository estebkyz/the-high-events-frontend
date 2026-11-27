import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import { DetailField, DetailFooter, DetailGrid, DetailHeader } from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import type { UsuarioItem } from "../types"
import { getUsuarioFullName } from "../utils"

export function UsuarioDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
}: DetailDrawerProps<UsuarioItem>) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de usuario"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar usuario"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.rol} />
            <StatusBadge status={item.estado} />
          </>
        }
        title={getUsuarioFullName(item)}
        subtitle={item.correo}
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
        <DetailField label="Rol asignado" value={item.rol} />
        <DetailField label="Último acceso" value={item.ultimoAcceso || "Nunca"} />
      </DetailGrid>
    </Drawer>
  )
}
