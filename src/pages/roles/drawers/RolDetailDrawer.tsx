import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import { TagsCell } from "@/components/list/cells"
import {
  DetailEmptyNote,
  DetailFooter,
  DetailHeader,
  DetailSection,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { PERMISSION_GROUPS } from "../permissions"
import type { Rol } from "../types"

export function RolDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
}: DetailDrawerProps<Rol>) {
  if (!item) return null
  const grupos = PERMISSION_GROUPS.map((group) => ({
    ...group,
    privileges: group.privileges.filter((p) => item.permisos.includes(p.id)),
  })).filter((group) => group.privileges.length > 0)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de rol"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar rol"
        />
      }
    >
      <DetailHeader
        badges={<StatusBadge status={item.estado} />}
        title={item.nombre}
        subtitle={item.descripcion || "Sin descripción"}
        meta={<span>{item.usuariosCount} usuario(s) vinculados</span>}
      />
      {grupos.length === 0 && <DetailEmptyNote text="Sin privilegios asignados." />}
      {grupos.map((group) => (
        <DetailSection
          key={group.id}
          title={group.label}
          count={group.privileges.length}
          noBorder
        >
          <TagsCell
            tags={group.privileges.map((p) => p.label)}
            max={group.privileges.length}
          />
        </DetailSection>
      ))}
    </Drawer>
  )
}
