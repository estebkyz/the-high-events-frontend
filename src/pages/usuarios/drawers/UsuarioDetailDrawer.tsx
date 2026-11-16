import React from "react"
import { Drawer } from "../../../components/Drawer"
import { StatusBadge } from "../../../components/StatusBadge"
import { Edit2, Clock } from "lucide-react"
import type { UsuarioItem } from "../types"
import { getUsuarioFullName } from "../utils"

interface UsuarioDetailDrawerProps {
  isOpen: boolean; user: UsuarioItem | null
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
      title="Detalle de Usuario"
      subtitle="Información del perfil, rol y auditoría de accesos"
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

        <div className="space-y-3 bg-[#1A1D23] border border-[#2D3748] rounded-xl p-4 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Documento de Identidad</span>
            <span className="text-[#F1F5F9] font-medium">
              {user.tipo_documento} {user.numero_documento}
            </span>
          </div>
          <div className="border-t border-[#2D3748]/50" />
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Teléfono de Contacto</span>
            <span className="text-[#F1F5F9] font-medium">{user.telefono}</span>
          </div>
          <div className="border-t border-[#2D3748]/50" />
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Rol Asignado</span>
            <span className="text-[#F1F5F9] font-medium">{user.rol}</span>
          </div>
          <div className="border-t border-[#2D3748]/50" />
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Último Acceso Registrado</span>
            <span className="text-[#F1F5F9] font-medium">
              {user.ultimoAcceso}
            </span>
          </div>
          <div className="border-t border-[#2D3748]/50" />
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">Estado de Cuenta</span>
            <span
              className={`font-semibold ${
                user.estado === "Activo" ? "text-[#10B981]" : "text-[#EF4444]"
              }`}
            >
              {user.estado}
            </span>
          </div>
        </div>

        {/* Historial de Sesiones */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[#A78BFA]" />
            <p className="text-[11px] text-[#A78BFA] uppercase tracking-wider font-semibold">
              Historial de Conexiones
            </p>
          </div>

          {!user.sesiones || user.sesiones.length === 0 ? (
            <div className="p-3 bg-[#1A1D23] border border-[#2D3748] rounded-xl text-center text-[#64748B] text-xs">
              Sin registros de sesión recientes
            </div>
          ) : (
            <div className="bg-[#1A1D23] border border-[#2D3748] rounded-xl divide-y divide-[#2D3748]/50 overflow-hidden">
              {user.sesiones.map((ses, idx) => (
                <div
                  key={idx}
                  className="p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="text-[#F1F5F9] font-medium leading-tight">
                      {ses.fecha}
                    </p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">
                      {ses.dispositivo} · IP {ses.ip}
                    </p>
                  </div>
                  <StatusBadge
                    status={ses.resultado}
                    className="text-[10px] font-bold px-2"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose()
              onOpenEdit(user)
            }}
            className="w-full h-[40px] rounded-xl text-[12px] font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Edit2 size={14} />
            Editar Usuario
          </button>
        </div>
      </div>
    </Drawer>
  )
}
