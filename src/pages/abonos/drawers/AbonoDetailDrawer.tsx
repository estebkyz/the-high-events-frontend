import type { ReactNode } from "react"
import { Banknote, Receipt } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { StatusBadge } from "@/components/StatusBadge"
import {
  DetailAction,
  DetailEmptyNote,
  DetailField,
  DetailFooter,
  DetailGrid,
  DetailHighlight,
  DetailList,
  DetailSection,
} from "@/components/detail"
import type { DetailDrawerProps } from "@/components/form/types"
import { CARTERA } from "../constants"
import type { AbonoItem, EstadoPago, PagoHistorial } from "../types"
import { admitePago, getTercero, printAbono } from "../utils"

interface AbonoDetailDrawerProps extends Omit<DetailDrawerProps<AbonoItem>, "onEdit"> {
  saving: boolean
  onRegistrarPago: (abono: AbonoItem) => void
  onVerificar: (abono: AbonoItem, pagoId: string, estado: EstadoPago) => unknown
}

export function AbonoDetailDrawer({
  isOpen,
  item,
  saving,
  onClose,
  onRegistrarPago,
  onVerificar,
}: AbonoDetailDrawerProps) {
  if (!item) return null
  const copy = CARTERA[item.tipoCartera]

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de ${copy.label.singular}`}
      footer={<DetailFooter onClose={onClose} />}
    >
      <DetailHighlight
        label="Monto total"
        value={item.total}
        sublabel={`${item.porcentaje}% liquidado`}
        tone="accent"
      />
      <DetailGrid>
        <DetailField label="Evento" value={item.evento} />
        <DetailField label={copy.tercero} value={getTercero(item)} />
        {item.servicio && <DetailField label="Servicio" value={item.servicio} />}
      </DetailGrid>

      <DetailSection title="Esquema de pagos (50 % / 50 %)">
        <DetailList>
          <CuotaRow
            label="Anticipo"
            monto={item.anticipo}
            estado={<StatusBadge status={item.estadoAnticipo} />}
          />
          <CuotaRow
            label="Saldo"
            monto={item.saldo}
            estado={<StatusBadge status={item.estadoSaldo} />}
          />
        </DetailList>
      </DetailSection>

      <DetailSection title="Transacciones" count={item.historial.length}>
        {item.historial.length === 0 ? (
          <DetailEmptyNote text="No se han registrado pagos aún." />
        ) : (
          <DetailList>
            {item.historial.map((pago) => (
              <PagoRow
                key={pago.id}
                pago={pago}
                saving={saving}
                onVerificar={(estado) =>
                  pago.id ? onVerificar(item, pago.id, estado) : undefined
                }
              />
            ))}
          </DetailList>
        )}
      </DetailSection>

      <DetailSection title="Acciones">
        <div className="space-y-2">
          {admitePago(item) && (
            <DetailAction
              icon={Banknote}
              label="Registrar transacción"
              tone="success"
              onClick={() => onRegistrarPago(item)}
            />
          )}
          <DetailAction
            icon={Receipt}
            label="Descargar comprobante"
            onClick={() => printAbono(item)}
          />
        </div>
      </DetailSection>
    </Drawer>
  )
}

interface CuotaRowProps {
  label: string
  monto: string
  estado: ReactNode
}

function CuotaRow({ label, monto, estado }: CuotaRowProps) {
  return (
    <div className="py-2.5 flex items-center justify-between gap-3">
      <div>
        <p className="text-[13px] font-medium text-[#F1F5F9]">{label}</p>
        <p className="text-[12px] text-[#10B981] font-semibold tabular-nums">{monto}</p>
      </div>
      {estado}
    </div>
  )
}

interface PagoRowProps {
  pago: PagoHistorial
  saving: boolean
  onVerificar: (estado: EstadoPago) => unknown
}

function PagoRow({ pago, saving, onVerificar }: PagoRowProps) {
  return (
    <div className="py-2.5 space-y-1 text-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-[#F1F5F9]">
          {pago.tipoPago}
          <span className="ml-2 font-normal text-[#94A3B8]">{pago.fecha}</span>
        </span>
        <span className="font-semibold text-[#10B981] tabular-nums">{pago.monto}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-[#94A3B8]">
          {[pago.metodo, pago.comprobante].filter(Boolean).join(" · ")}
        </p>
        <StatusBadge status={pago.estado} />
      </div>
      {pago.observaciones && (
        <p className="text-[11px] text-[#94A3B8] italic">{pago.observaciones}</p>
      )}
      {pago.estado === "Pendiente" && (
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            disabled={saving}
            onClick={() => onVerificar("Pagado")}
            className="text-[11px] font-semibold text-[#10B981] hover:underline cursor-pointer disabled:opacity-50"
          >
            Verificar pago
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onVerificar("Rechazado")}
            className="text-[11px] font-semibold text-[#EF4444] hover:underline cursor-pointer disabled:opacity-50"
          >
            Rechazar
          </button>
        </div>
      )}
    </div>
  )
}
