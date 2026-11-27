import { CreditCard, DollarSign, Download } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailAction,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHeader,
  DetailHighlight,
  DetailSection,
  DetailStatusPicker,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { ESTADOS_VENTA } from "../constants"
import type { EstadoVenta, VentaItem } from "../types"
import { printVenta } from "../utils"
import { MODULE_ACCESS } from "@/constants/access"

interface VentaDetailDrawerProps extends DetailDrawerProps<VentaItem> {
  onStatusChange: (id: string, estado: EstadoVenta) => unknown
  onVerAbonos: () => void
}

export function VentaDetailDrawer({
  isOpen,
  item,
  onClose,
  onEdit,
  onStatusChange,
  onVerAbonos,
}: VentaDetailDrawerProps) {
  if (!item) return null

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de venta"
      footer={
        <DetailFooter
          onClose={onClose}
          onEdit={() => onEdit(item)}
          editLabel="Editar venta"
        />
      }
    >
      <DetailHeader
        badges={
          <>
            <StatusBadge status={item.tipo} />
            <StatusBadge status={item.estado_venta} />
          </>
        }
        title={item.codigo}
        subtitle={item.clienteEvento}
      />
      <DetailGrid>
        <DetailField label="Fecha" value={item.fecha} />
        <DetailField label="Factura" value={item.numero_factura} />
      </DetailGrid>

      <DetailSection title="Pago" icon={DollarSign}>
        <DetailHighlight
          label="Total"
          value={item.total}
          badge={<StatusBadge status={item.estadoPago} />}
          tone="success"
        />
      </DetailSection>

      <DetailSection title="Estado de la venta">
        <DetailStatusPicker
          value={item.estado_venta}
          options={ESTADOS_VENTA}
          onChange={(estado) => onStatusChange(item.id, estado)}
        />
      </DetailSection>

      <DetailSection title="Acciones">
        <div className="space-y-2">
          {item.estado_venta === "Confirmada" && (
            <DetailAction
              icon={CreditCard}
              label="Ver abonos"
              tone="accent"
              onClick={onVerAbonos}
              needs={MODULE_ACCESS.abonos.view}
            />
          )}
          <DetailAction
            icon={Download}
            label="Descargar comprobante"
            onClick={() => printVenta(item)}
            needs={["ventas.comprobante"]}
          />
        </div>
      </DetailSection>
    </Drawer>
  )
}
