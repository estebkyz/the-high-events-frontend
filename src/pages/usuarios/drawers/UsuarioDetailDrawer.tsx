import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      size="detail"
      title="Detalle de usuario"
      subtitle="Información de la cuenta registrada en la tabla usuarios"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3.5 p-3.5 bg-[#1A1D23] rounded-xl border border-[#2D3748]">
          <div
            className="w-11 h-11 rounded-xl bg-[#7C3AED] flex items-center justify-center font-bold text-white text-base flex-shrink-0"
            style={{ boxShadow: "0 0 15px rgba(124,58,237,0.3)" }}
          >
            {getUsuarioFullName(user).charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-[#F1F5F9] truncate">
              {getUsuarioFullName(user)}
            </h3>
            <p className="text-[12px] text-[#94A3B8] truncate">{user.correo}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={user.rol} />
              <StatusBadge status={user.estado} />
            </div>
          </div>
        </div>

        {/* Campos exactos de la tabla usuarios en la BD distribuidos en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1A1D23] border border-[#2D3748] rounded-xl p-4 text-[12px]">
          <div>
            <p className="text-[#64748B] text-[11px]">Tipo y Nro. Documento</p>
            <p className="text-[#F1F5F9] font-semibold mt-0.5">
              {user.tipo_documento} {user.numero_documento}
            </p>
          </div>
          <div>
            <p className="text-[#64748B] text-[11px]">Teléfono de Contacto</p>
            <p className="text-[#F1F5F9] font-semibold mt-0.5">
              {user.telefono}
            </p>
          </div>
          <div>
            <p className="text-[#64748B] text-[11px]">Nombres</p>
            <p className="text-[#F1F5F9] font-semibold mt-0.5">
              {user.primer_nombre} {user.segundo_nombre || ""}
            </p>
          </div>
          <div>
            <p className="text-[#64748B] text-[11px]">Apellidos</p>
            <p className="text-[#F1F5F9] font-semibold mt-0.5">
              {user.primer_apellido} {user.segundo_apellido || ""}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[#64748B] text-[11px]">Correo Electrónico</p>
            <p className="text-[#F1F5F9] font-semibold mt-0.5 break-all">
              {user.correo}
            </p>
          </div>
          <div>
            <p className="text-[#64748B] text-[11px]">Rol Asignado (FK id_rol)</p>
            <p className="text-[#F1F5F9] font-semibold mt-0.5">{user.rol}</p>
          </div>
          <div>
            <p className="text-[#64748B] text-[11px]">Estado de Cuenta</p>
            <p
              className={`font-semibold mt-0.5 ${
                user.estado === "Activo" ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {user.estado}
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-[#2D3748]">
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
            <Edit2 size={14} />
            Editar usuario
          </button>
        </div>
      </div>
    </Drawer>
  )
}
