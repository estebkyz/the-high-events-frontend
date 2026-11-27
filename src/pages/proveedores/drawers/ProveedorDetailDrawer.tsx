import {
  Building2,
  Mail,
  Package,
  PackagePlus,
  Phone,
  Sparkles,
  User,
} from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import { TagsCell } from "@/components/list/cells"
import {
  DetailAction,
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailList,
  DetailSection,
  DetailStatusPicker,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { ESTADOS_ACTIVO, type EstadoActivo } from "@/constants/common"
import type { EquipoItem } from "@/pages/equipos/types"
import { ContratacionRow } from "../components/ContratacionRow"
import type { ProveedorItem } from "../types"
import { getProveedorContacto } from "../utils"
import { MODULE_ACCESS } from "@/constants/access"

interface ProveedorDetailDrawerProps extends DetailDrawerProps<ProveedorItem> {
  /** Equipos alquilados vinculados a este proveedor. */
  equipos: EquipoItem[]
  onCreateEquipo: (proveedor: ProveedorItem) => void
  onStatusChange: (id: string, estado: EstadoActivo) => unknown
}

export function ProveedorDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  equipos,
  onCreateEquipo,
  onStatusChange,
}: ProveedorDetailDrawerProps) {
  if (!item) return null
  const servicios = item.servicios ?? []
  const historial = item.historial ?? []

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de proveedor"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar proveedor"
        />
      }
    >
      <DetailHeader
        badges={<StatusBadge status={item.estado} />}
        title={item.razon_social}
        subtitle={`NIT ${item.nit_documento}`}
      />
      <DetailGrid>
        <DetailField label="Razón social" icon={Building2} value={item.razon_social} />
        <DetailField label="Contacto" icon={User} value={getProveedorContacto(item)} />
        <DetailField label="Teléfono" icon={Phone} value={item.telefono} />
        <DetailField
          label="Correo electrónico"
          icon={Mail}
          value={item.correo}
          valueClassName="break-all"
        />
      </DetailGrid>

      <DetailSection title="Servicios ofrecidos" icon={Sparkles} count={servicios.length}>
        {servicios.length > 0 ? (
          <TagsCell tags={servicios} max={servicios.length} />
        ) : (
          <DetailEmptyNote text="No registra servicios especializados." />
        )}
      </DetailSection>

      <DetailSection title="Equipos alquilados" icon={Package} count={equipos.length}>
        {equipos.length > 0 ? (
          <DetailList>
            {equipos.map((eq) => (
              <div
                key={eq.id}
                className="py-2.5 flex items-center justify-between gap-2 text-xs"
              >
                <span className="font-medium text-ink truncate">{eq.nombre}</span>
                <span className="text-xs text-ink-muted tabular-nums">{eq.serie}</span>
              </div>
            ))}
          </DetailList>
        ) : (
          <DetailEmptyNote text="Sin equipos vinculados en el inventario." />
        )}
        <DetailAction
          icon={PackagePlus}
          label="Crear equipo de este proveedor"
          onClick={() => onCreateEquipo(item)}
          needs={MODULE_ACCESS.equipos.create}
        />
      </DetailSection>

      <DetailSection title="Historial de contrataciones" count={historial.length}>
        {historial.length > 0 ? (
          <DetailList>
            {historial.map((contratacion) => (
              <ContratacionRow
                key={`${contratacion.evento}-${contratacion.fecha}`}
                contratacion={contratacion}
              />
            ))}
          </DetailList>
        ) : (
          <DetailEmptyNote text="Sin contrataciones aún." />
        )}
      </DetailSection>

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
