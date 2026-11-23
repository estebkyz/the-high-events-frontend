import React, { useMemo } from "react"
import { Trash2, Boxes } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect, type SelectOption } from "../../../components/CustomSelect"
import { useCrudResource } from "../../../hooks/useCrudResource"
import type { EventoItem } from "../../eventos/types"
import type { EmpleadoItem } from "../../empleados/types"
import { getEmpleadoFullName } from "../../empleados/utils"
import type { EquipoItem } from "../../equipos/types"
import type { PrestamoItem, PrestamoFormData, EquipoPrestado } from "../types"

interface PrestamoFormDrawerProps {
  mode: "new" | "edit"
  isOpen: boolean
  onClose: () => void
  prestamo: PrestamoItem | null
  formData: PrestamoFormData
  setFormData: React.Dispatch<React.SetStateAction<PrestamoFormData>>
  onSubmit: (e: React.FormEvent) => void
}

export function PrestamoFormDrawer({
  mode,
  isOpen,
  onClose,
  prestamo,
  formData,
  setFormData,
  onSubmit,
}: PrestamoFormDrawerProps) {
  const isEdit = mode === "edit"
  const selectedEquipos: EquipoPrestado[] = formData.equipos ?? []
  const { items: rawEmpleados } = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const { items: rawEventos } = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const { items: rawEquipos } = useCrudResource<EquipoItem>({ endpoint: "/equipos" })

  const availableEmployees = useMemo(
    () =>
      rawEmpleados.map((e) => ({
        id: e.id,
        nombre: getEmpleadoFullName(e),
        cargo: e.cargo,
      })),
    [rawEmpleados],
  )

  const empleadoOptions = useMemo<SelectOption[]>(
    () =>
      availableEmployees.map((emp) => ({
        label: emp.nombre,
        value: emp.nombre,
        sublabel: emp.cargo,
      })),
    [availableEmployees],
  )

  const eventoOptions = useMemo<SelectOption[]>(
    () =>
      rawEventos.map((ev) => ({
        label: ev.nombre,
        value: ev.nombre,
        sublabel: `${ev.cliente_nombre} · ${ev.direccion}`,
      })),
    [rawEventos],
  )

  // Equipos propios disponibles para préstamo
  const equipoCatalogOptions = useMemo<SelectOption[]>(() => {
    const selectedIds = new Set(selectedEquipos.map((e) => e.id))
    return rawEquipos
      .filter((eq) => eq.propiedad === "Propio" && !selectedIds.has(eq.id))
      .map((eq) => ({
        label: `${eq.nombre} (${eq.serie})`,
        value: eq.id,
        sublabel: `${eq.categoria} · Estado: ${eq.estadoOperativo}`,
      }))
  }, [selectedEquipos, rawEquipos])

  const handleAddEquipo = (eqId: string) => {
    const found = rawEquipos.find((e) => e.id === eqId)
    if (!found) return
    const nuevo: EquipoPrestado = {
      id: found.id,
      nombre: found.nombre,
      serie: found.serie,
      condicionSalida: "Bueno",
    }
    setFormData((f) => ({
      ...f,
      equipos: [...(f.equipos ?? []), nuevo],
    }))
  }

  const handleRemoveEquipo = (eqId: string) => {
    setFormData((f) => ({
      ...f,
      equipos: (f.equipos ?? []).filter((e) => e.id !== eqId),
    }))
  }

  const handleConditionChange = (eqId: string, cond: string) => {
    setFormData((f) => ({
      ...f,
      equipos: (f.equipos ?? []).map((e) =>
        e.id === eqId ? { ...e, condicionSalida: cond } : e,
      ),
    }))
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      width="max-w-2xl"
      title={
        isEdit ? `Editar préstamo ${prestamo?.codigo ?? ""}` : "Crear préstamo"
      }
      subtitle="Asigna equipos propios disponibles a un colaborador responsable y a un evento (Tablas prestamos + detalle_prestamo)"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Fila 1: Responsable (FK id_empleado) y Evento (FK id_evento) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Empleado responsable (FK id_empleado) <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={empleadoOptions}
              value={formData.responsable ?? ""}
              searchable={true}
              placeholder="Seleccionar colaborador..."
              onChange={(val) => {
                const matched = availableEmployees.find((e) => e.nombre === val)
                setFormData((f) => ({
                  ...f,
                  responsable: val,
                  responsable_id: matched ? Number(matched.id) : undefined,
                }))
              }}
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[#F1F5F9] mb-1.5 block">
              Evento destino (FK id_evento) <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              options={eventoOptions}
              value={formData.evento ?? ""}
              searchable={true}
              placeholder="Seleccionar evento..."
              onChange={(val) => {
                const matched = rawEventos.find((ev) => ev.nombre === val)
                setFormData((f) => ({
                  ...f,
                  evento: val,
                  evento_id: matched ? Number(matched.id) : undefined,
                }))
              }}
            />
          </div>
        </div>

        {/* Fila 2: Fechas de Salida y Devolución Esperada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <FormInput
            label="Fecha de salida"
            type="date"
            required
            value={formData.fechaSalida ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, fechaSalida: e.target.value }))
            }
          />
          <FormInput
            label="Fecha de devolución esperada"
            type="date"
            required
            value={formData.fechaDevolucion ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, fechaDevolucion: e.target.value }))
            }
          />
        </div>

        {/* Fila 3: Selección de Equipos a Prestar (Tabla detalle_prestamo) */}
        <div className="pt-3 border-t border-[#262D3D] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-[13px] font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <Boxes size={14} className="text-[#A78BFA]" />
                <span>Equipos técnicos a prestar (Tabla detalle_prestamo) *</span>
              </label>
              <p className="text-[11px] text-[#94A3B8]">
                Selecciona del inventario los equipos propios que se entregan al responsable
              </p>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#7C3AED]/20 text-[#C4B5FD]">
              {selectedEquipos.length}{" "}
              {selectedEquipos.length === 1 ? "equipo" : "equipos"}
            </span>
          </div>

          <CustomSelect
            options={equipoCatalogOptions}
            value=""
            searchable={true}
            clearOnSelect={true}
            placeholder="+ Buscar y agregar equipo propio al préstamo..."
            onChange={handleAddEquipo}
          />

          {selectedEquipos.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#111318] border border-dashed border-[#262D3D] text-center text-xs text-[#94A3B8]">
              Aún no has seleccionado ningún equipo. Usa el buscador superior para agregar los equipos que se van a prestar.
            </div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {selectedEquipos.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#111318] border border-[#262D3D]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#F8FAFC] truncate">
                      {eq.nombre}
                    </p>
                    <p className="text-[10.5px] font-mono text-[#A78BFA]">
                      Serie: {eq.serie}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-[#94A3B8]">
                      Estado salida:
                    </span>
                    <select
                      value={eq.condicionSalida}
                      onChange={(e) =>
                        handleConditionChange(eq.id, e.target.value)
                      }
                      className="h-[32px] px-2.5 bg-[#181B22] border border-[#262D3D] rounded-lg text-xs text-[#F8FAFC] focus:outline-none focus:border-[#7C3AED] cursor-pointer"
                    >
                      <option value="Bueno">Bueno</option>
                      <option value="Regular">Regular (Con detalle)</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipo(eq.id)}
                      title="Quitar equipo del préstamo"
                      className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Observaciones de entrega */}
        <div>
          <FormInput
            label="Observaciones de entrega (Opcional)"
            placeholder="Ej. Incluye maleta rígida de transporte y cables XLR..."
            value={formData.observaciones_entrega ?? ""}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                observaciones_entrega: e.target.value,
              }))
            }
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#262D3D]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] border border-[#262D3D] cursor-pointer hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            {isEdit ? "Guardar cambios" : "Crear préstamo"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
