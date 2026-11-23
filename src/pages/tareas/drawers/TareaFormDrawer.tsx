import React, { useMemo } from "react"
import { BookOpen } from "lucide-react"
import { Drawer } from "../../../components/Drawer"
import { FormInput } from "../../../components/FormInput"
import { CustomSelect, type SelectOption } from "../../../components/CustomSelect"
import type { TareaItem, TareaFormData, Fase, Prioridad } from "../types"
import { FASE_OPTIONS, PRIORIDAD_OPTIONS } from "../data"
import { useCrudResource } from "../../../hooks/useCrudResource"
import type { EventoItem } from "../../eventos/types"
import type { EmpleadoItem } from "../../empleados/types"
import { getEmpleadoFullName } from "../../empleados/utils"
import type { TareaCatalogoItem } from "../../eventos/catalogStore"

interface TareaFormDrawerProps {
  isOpen: boolean
  mode: "new" | "edit"
  selectedTask: TareaItem | null
  catalogoTareas: TareaCatalogoItem[]
  onCreateCatalogTaskInline: (nombre: string, faseActual: Fase) => TareaCatalogoItem
  editForm: TareaFormData
  setEditForm: React.Dispatch<React.SetStateAction<TareaFormData>>
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
}

function mapFaseSugeridaToFase(faseSug: string): Fase {
  if (
    faseSug === "Planificación" ||
    faseSug === "Montaje" ||
    faseSug === "Ejecución" ||
    faseSug === "Desmontaje"
  ) {
    return faseSug
  }
  return "Montaje"
}

export const TareaFormDrawer: React.FC<TareaFormDrawerProps> = ({
  isOpen,
  mode,
  selectedTask,
  catalogoTareas,
  onCreateCatalogTaskInline,
  editForm,
  setEditForm,
  onClose,
  onSubmit,
}) => {
  const { items: rawEmpleados } = useCrudResource<EmpleadoItem>({ endpoint: "/empleados" })
  const { items: rawEventos } = useCrudResource<EventoItem>({ endpoint: "/eventos" })
  const empleadosCatalogo = useMemo(
    () =>
      rawEmpleados.map((e) => ({
        id: e.id,
        nombre: getEmpleadoFullName(e),
        cargo: e.cargo,
        telefono: e.telefono,
        correo: e.correo,
      })),
    [rawEmpleados],
  )

  const tareaCatalogoOptions = useMemo<SelectOption[]>(
    () =>
      catalogoTareas.map((t) => ({
        label: t.nombre_tarea,
        value: t.id,
        badge: `${t.codigo} · ${t.fase_sugerida}`,
        sublabel: t.descripcion,
      })),
    [catalogoTareas],
  )

  const eventoOptions = useMemo<SelectOption[]>(() => {
    const base: SelectOption[] = rawEventos.map((ev) => ({
      label: ev.nombre,
      value: ev.nombre,
      badge: ev.modalidad,
      sublabel: `${(ev.hora_inicio || "").split("T")[0]} · ${ev.direccion}`,
    }))
    if (
      editForm.evento &&
      !base.some((b) => b.value === editForm.evento)
    ) {
      base.unshift({
        label: editForm.evento,
        value: editForm.evento,
        badge: "Evento",
        sublabel: "Orden de producción activa",
      })
    }
    return base
  }, [editForm.evento, rawEventos])

  const empleadoOptions = useMemo<SelectOption[]>(() => {
    const base = empleadosCatalogo.map((emp) => ({
      label: emp.nombre,
      value: emp.nombre,
      badge: emp.cargo,
      sublabel: emp.telefono || emp.correo || "Personal técnico interno",
    }))
    if (
      editForm.responsable &&
      !base.some((b) => b.value === editForm.responsable)
    ) {
      base.unshift({
        label: editForm.responsable,
        value: editForm.responsable,
        badge: editForm.cargo_responsable || "Técnico",
        sublabel: "Personal asignado",
      })
    }
    return base
  }, [empleadosCatalogo, editForm.responsable, editForm.cargo_responsable])

  const selectedCatalogId = useMemo(() => {
    if (editForm.tarea_id) return String(editForm.tarea_id)
    const found = catalogoTareas.find(
      (t) => t.nombre_tarea.toLowerCase() === (editForm.tarea || "").toLowerCase(),
    )
    return found?.id || catalogoTareas[0]?.id || "1"
  }, [editForm.tarea_id, editForm.tarea, catalogoTareas])

  const handleSelectCatalogTask = (taskId: string) => {
    const cat = catalogoTareas.find((t) => t.id === taskId)
    if (!cat) return
    const mappedFase = mapFaseSugeridaToFase(cat.fase_sugerida)
    setEditForm((f) => ({
      ...f,
      tarea_id: cat.id,
      codigo_tarea: cat.codigo,
      tarea: cat.nombre_tarea,
      descripcion_catalogo: cat.descripcion,
      fase: mappedFase,
      notas: f.notas?.trim() ? f.notas : cat.descripcion,
    }))
  }

  const handleSelectEvento = (eventoNombre: string) => {
    const ev = rawEventos.find((e) => e.nombre === eventoNombre)
    setEditForm((f) => ({
      ...f,
      evento: eventoNombre,
      evento_id: ev?.id,
      fechaLimite: ev?.hora_inicio
        ? ev.hora_inicio.split("T")[0]
        : f.fechaLimite,
    }))
  }

  const handleSelectEmpleado = (empleadoNombre: string) => {
    const emp = empleadosCatalogo.find((e) => e.nombre === empleadoNombre)
    setEditForm((f) => ({
      ...f,
      responsable: empleadoNombre,
      responsable_id: emp?.id,
      cargo_responsable: emp?.cargo,
    }))
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      size="modal"
      title={
        mode === "edit"
          ? "Editar Tarea Asignada (`evento_tarea`)"
          : "Asignar Tarea del Catálogo a Evento (`evento_tarea`)"
      }
      subtitle={
        mode === "edit"
          ? `${selectedTask?.codigo_tarea || "TAR"} · ${selectedTask?.tarea}`
          : "Selecciona una tarea del catálogo maestro y asígnala a un evento y empleado responsable."
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} className="text-[#A78BFA]" />
              Tarea del Catálogo Maestro (`tarea`){" "}
              <span className="text-[#EF4444]">*</span>
            </span>
            {editForm.codigo_tarea && (
              <span className="font-mono text-[10px] text-[#A78BFA]">
                {editForm.codigo_tarea}
              </span>
            )}
          </label>
          <CustomSelect
            value={selectedCatalogId}
            options={tareaCatalogoOptions}
            searchable={true}
            allowCreate={true}
            createLabel="Crear nueva tarea en el catálogo"
            placeholder="Seleccionar tarea del catálogo..."
            onChange={handleSelectCatalogTask}
            onCreate={(query) => {
              const created = onCreateCatalogTaskInline(
                query,
                (editForm.fase as Fase) || "Montaje",
              )
              setEditForm((f) => ({
                ...f,
                tarea_id: created.id,
                codigo_tarea: created.codigo,
                tarea: created.nombre_tarea,
                descripcion_catalogo: created.descripcion,
                notas: f.notas?.trim() ? f.notas : created.descripcion,
              }))
            }}
          />
          {editForm.descripcion_catalogo && (
            <p className="text-[11px] text-[#94A3B8] bg-[#111318] border border-[#262D3D] rounded-xl px-3 py-2 mt-2 leading-relaxed">
              <span className="font-semibold text-[#CBD5E1]">
                Estándar del catálogo:{" "}
              </span>
              {editForm.descripcion_catalogo}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Evento Asociado (`evento`) <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              value={editForm.evento ?? ""}
              options={eventoOptions}
              searchable={true}
              onChange={handleSelectEvento}
              placeholder="Seleccionar evento..."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Empleado Responsable (`empleado`) <span className="text-[#EF4444]">*</span>
            </label>
            <CustomSelect
              value={editForm.responsable ?? ""}
              options={empleadoOptions}
              searchable={true}
              onChange={handleSelectEmpleado}
              placeholder="Seleccionar responsable..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Fase en el Evento
            </label>
            <CustomSelect
              value={editForm.fase ?? "Montaje"}
              onChange={(val) =>
                setEditForm((f) => ({ ...f, fase: val as Fase }))
              }
              options={FASE_OPTIONS}
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Prioridad
            </label>
            <CustomSelect
              value={editForm.prioridad ?? "Media"}
              onChange={(val) =>
                setEditForm((f) => ({ ...f, prioridad: val as Prioridad }))
              }
              options={PRIORIDAD_OPTIONS}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <FormInput
            label="Fecha Programada"
            type="date"
            required
            value={editForm.fechaLimite ?? ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, fechaLimite: e.target.value }))
            }
          />
          <FormInput
            label="Hora Inicio"
            type="time"
            value={editForm.hora_inicio_estimada ?? "08:00"}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                hora_inicio_estimada: e.target.value,
              }))
            }
          />
          <FormInput
            label="Hora Fin"
            type="time"
            value={editForm.hora_fin_estimada ?? "13:00"}
            onChange={(e) =>
              setEditForm((f) => ({
                ...f,
                hora_fin_estimada: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Novedades de Avance / Instrucciones de Campo
          </label>
          <textarea
            value={editForm.notas ?? ""}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, notas: e.target.value }))
            }
            placeholder="Observaciones operativas, requerimientos del venue o novedades reportadas..."
            rows={3}
            className="px-3.5 py-2.5 bg-[#111318] border border-[#2D3748] rounded-xl text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] resize-none"
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2D3748]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all shadow-sm shadow-[#7C3AED]/25 cursor-pointer"
          >
            {mode === "edit" ? "Actualizar Asignación" : "Asignar Tarea al Evento"}
          </button>
        </div>
      </form>
    </Drawer>
  )
}
