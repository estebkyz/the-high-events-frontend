import { useState } from "react"
import { Boxes, Layers, UserCheck } from "lucide-react"
import { SegmentedControl } from "@/components/SegmentedControl"
import type { EventoSectionProps } from "../types"
import type { EventoCatalogs } from "../useEventoCatalogs"
import { EventoEquiposSection } from "./EventoEquiposSection"
import { EventoServiciosSection } from "./EventoServiciosSection"
import { EventoStaffSection } from "./EventoStaffSection"

interface EventoRecursosProps extends EventoSectionProps {
  catalogs: EventoCatalogs
  onCreateServicio: (nombre: string) => void
  onCreateEmpleado: (nombre: string) => void
}

/** Detalles operativos del evento en pestañas. */
export function EventoRecursos({
  form,
  onChange,
  catalogs,
  onCreateServicio,
  onCreateEmpleado,
}: EventoRecursosProps) {
  const [tab, setTab] = useState("servicios")

  return (
    <section className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262D3D] pb-4">
        <h2 className="text-[15px] font-bold text-[#F8FAFC]">Detalles operativos</h2>
        <SegmentedControl
          label="Detalles del evento"
          value={tab}
          onChange={setTab}
          options={[
            {
              value: "servicios",
              label: `Servicios (${form.servicios.length})`,
              icon: Layers,
            },
            {
              value: "equipos",
              label: `Equipos (${form.equiposAsignados.length})`,
              icon: Boxes,
            },
            {
              value: "empleados",
              label: `Empleados (${form.empleadosAsignados.length})`,
              icon: UserCheck,
            },
          ]}
        />
      </div>

      {tab === "servicios" && (
        <EventoServiciosSection
          form={form}
          onChange={onChange}
          servicios={catalogs.servicios.items}
          proveedores={catalogs.proveedores.items}
          onCreateServicio={onCreateServicio}
        />
      )}
      {tab === "equipos" && (
        <EventoEquiposSection
          form={form}
          onChange={onChange}
          equipos={catalogs.equipos.items}
        />
      )}
      {tab === "empleados" && (
        <EventoStaffSection
          form={form}
          onChange={onChange}
          empleados={catalogs.empleados.items}
          tareas={catalogs.tareas.items}
          onCreateEmpleado={onCreateEmpleado}
        />
      )}
    </section>
  )
}
