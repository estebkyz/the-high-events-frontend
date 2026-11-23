import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import {
  DetailHeader,
  DetailSection,
  DetailGrid,
  DetailField,
} from "../../../components/detail"
import { Edit2 } from "lucide-react"
import type { UsuarioItem } from "../types"
import { getUsuarioFullName } from "../utils"

interface UsuarioDetailDrawerProps {
  isOpen: boolean
  user: UsuarioItem | null
  onClose: () => void
  onOpenEdit: (user: UsuarioItem) => void
}

export const UsuarioDetailDrawer: React.FC<UsuarioDetailDrawerProps> = ({
  isOpen,
  user,
  onClose,
  onOpenEdit,
}) => {
  if (!user) return null

  const fullName = getUsuarioFullName(user)

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de usuario"
      subtitle="Información de la cuenta registrada en la tabla usuarios"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] border border-[#2D3748] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenEdit(user)
            }}
            className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 size={14} aria-hidden="true" />
            <span>Editar usuario</span>
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <DetailHeader
          badges={
            <>
              <StatusBadge status={user.rol} />
              <StatusBadge status={user.estado} />
            </>
          }
          title={
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center font-bold text-white text-sm shrink-0"
                style={{ boxShadow: "0 0 15px rgba(124,58,237,0.3)" }}
              >
                {fullName.charAt(0)}
              </span>
              <span className="truncate">{fullName}</span>
            </span>
          }
          subtitle={user.correo}
        />

        <DetailSection title="Datos de la Cuenta" noBorder>
          <DetailGrid>
            <DetailField
              label="Tipo y Nro. Documento"
              value={`${user.tipo_documento} ${user.numero_documento}`}
            />
            <DetailField
              label="Teléfono de Contacto"
              value={user.telefono}
              valueClassName="tabular-nums"
            />
            <DetailField
              label="Nombre"
              value={`${user.primer_nombre} ${user.segundo_nombre || ""}`.trim()}
            />
            <DetailField
              label="Apellido"
              value={`${user.primer_apellido} ${user.segundo_apellido || ""}`.trim()}
            />
            <DetailField
              label="Correo Electrónico"
              value={user.correo}
              span={2}
              valueClassName="break-all"
            />
            <DetailField
              label="Rol Asignado (FK id_rol)"
              value={user.rol}
            />
            <DetailField
              label="Estado de Cuenta"
              value={user.estado}
              valueClassName={
                user.estado === "Activo" ? "text-[#10B981]" : "text-[#EF4444]"
              }
            />
          </DetailGrid>
        </DetailSection>
      </div>
    </Drawer>
  )
}
