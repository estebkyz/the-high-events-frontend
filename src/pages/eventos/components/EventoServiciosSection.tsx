import { PackagePlus } from "lucide-react"
import { CustomSelect } from "@/components/CustomSelect"
import { RemoveButton } from "@/components/form/RemoveButton"
import type { ProveedorItem } from "@/pages/proveedores/types"
import type { ServicioItem } from "@/pages/servicios/types"
import { formatCOP, parseCOP } from "@/utils/format"
import { resolverServicios } from "../form"
import type { EventoSectionProps } from "../types"
import { ResourceSection } from "./ResourceSection"
import { MODULE_ACCESS } from "@/constants/access"
import { EMPRESA } from "@/constants/empresa"

interface EventoServiciosSectionProps extends EventoSectionProps {
  servicios: ServicioItem[]
  proveedores: ProveedorItem[]
  onCreateServicio: (nombre: string) => void
}

/** Cliente: servicios heredados de la cotización. Propio: se eligen del catálogo. */
export function EventoServiciosSection({
  form,
  onChange,
  servicios,
  proveedores,
  onCreateServicio,
}: EventoServiciosSectionProps) {
  const esPropio = form.modalidad === "Propio"
  const detalles = resolverServicios(form, servicios)
  const total = esPropio
    ? detalles.reduce((sum, d) => sum + parseCOP(d.costo), 0)
    : (form.valor_total ?? 0)

  const proveedorOptions = [
    { label: `Ejecución interna (${EMPRESA.nombre})`, value: "" },
    ...proveedores
      .filter((p) => p.estado === "Activo")
      .map((p) => ({ label: p.razon_social, value: p.id })),
  ]

  const handleAdd = (id: string) => {
    const servicio = servicios.find((s) => s.id === id)
    if (servicio && !form.servicios.includes(servicio.nombre)) {
      onChange({ servicios: [...form.servicios, servicio.nombre] })
    }
  }

  const handleRemove = (nombre: string) =>
    onChange({
      servicios: form.servicios.filter((s) => s !== nombre),
      serviciosDetalles: form.serviciosDetalles.filter((d) => d.nombre !== nombre),
    })

  const handleProveedor = (nombre: string, proveedorId: string) => {
    const proveedor = proveedores.find((p) => p.id === proveedorId)
    onChange({
      serviciosDetalles: detalles.map((d) =>
        d.nombre === nombre
          ? {
              ...d,
              proveedor_id: proveedor?.id,
              proveedor_nombre: proveedor?.razon_social,
            }
          : d,
      ),
    })
  }

  return (
    <ResourceSection
      label="Servicios"
      picker={
        esPropio
          ? {
              placeholder: "Agregar servicio",
              options: servicios
                .filter((s) => !form.servicios.includes(s.nombre))
                .map((s) => ({
                  label: s.nombre,
                  value: s.id,
                  badge: s.categoria,
                  sublabel: s.precioBase,
                })),
              onAdd: handleAdd,
              createLabel: "Crear servicio",
              onCreate: onCreateServicio,
              createNeeds: MODULE_ACCESS.servicios.create,
            }
          : undefined
      }
      summary={
        detalles.length > 0 && (
          <p className="text-xs text-ink-muted">
            {esPropio ? "Total estimado: " : "Total cotizado: "}
            <span className="font-semibold text-ink tabular-nums">
              {formatCOP(total)}
            </span>
          </p>
        )
      }
      isEmpty={detalles.length === 0}
      empty={{
        icon: PackagePlus,
        title: "Sin servicios",
        description: esPropio
          ? "Agrega del catálogo los servicios que requiere el evento."
          : "Los servicios se heredan de la cotización seleccionada.",
      }}
    >
      {detalles.map((detalle) => (
        <div
          key={detalle.nombre}
          className="py-3 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_260px_auto] items-center gap-3"
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ink">{detalle.nombre}</p>
            <p className="text-xs text-ink-muted mt-0.5">
              {detalle.categoria} · {formatCOP(parseCOP(detalle.costo))}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 row-start-2 sm:row-start-auto">
            <CustomSelect
              ariaLabel={`Proveedor de ${detalle.nombre}`}
              value={detalle.proveedor_id ?? ""}
              options={proveedorOptions}
              onChange={(val) => handleProveedor(detalle.nombre, val)}
            />
          </div>
          {esPropio && (
            <RemoveButton
              label={`Quitar ${detalle.nombre}`}
              onClick={() => handleRemove(detalle.nombre)}
            />
          )}
        </div>
      ))}
    </ResourceSection>
  )
}
