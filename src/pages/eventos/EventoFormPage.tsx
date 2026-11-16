import { useState, useEffect, useRef } from "react"
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useToast } from "../../components/Toast"
import { ROUTE_PATHS, EVENTO_PATHS } from "../../routes/paths"
import {
  EVENTOS_MOCK,
  CLIENTES_CATALOGO,
  AVAILABLE_EMPLOYEES,
  TAREAS_CATALOGO,
} from "./data"
import { createEmptyEventoForm, createInitialAssignments } from "./formState"
import { validateEventoForm } from "./validation"
import { EventoDatosSection } from "./components/EventoDatosSection"
import { EventoServiciosSection } from "./components/EventoServiciosSection"
import { EventoEquiposSection } from "./components/EventoEquiposSection"
import { EventoStaffSection } from "./components/EventoStaffSection"
import {
  saveEventoFormDraft,
  loadEventoFormDraft,
  clearEventoFormDraft,
} from "./catalogStore"
import { syncEventoTareasFromEvento } from "../tareas/data"
import type { AsignacionesMap, EventoFormValues, EventoItem } from "./types"

export default function EventoFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const searchParams = new URLSearchParams(location.search)
  const initialFecha =
    searchParams.get("fecha") ||
    (location.state as { fecha?: string } | null)?.fecha
  const isFromDashboard = Boolean(
    (location.state as { fromDashboard?: boolean } | null)?.fromDashboard,
  )

  const isEditing = Boolean(id)
  const existing = id ? EVENTOS_MOCK.find((ev) => ev.id === id) : undefined

  const savedDraft = loadEventoFormDraft()

  const [form, setForm] = useState<EventoFormValues>(() => {
    if (savedDraft?.form) {
      return savedDraft.form
    }
    if (existing) {
      return { ...existing }
    }
    const empty = createEmptyEventoForm()
    if (initialFecha) {
      return {
        ...empty,
        hora_inicio: `${initialFecha}T19:00`,
        hora_fin: `${initialFecha}T23:59`,
      }
    }
    return empty
  })

  const [equiposAsignados, setEquiposAsignados] = useState<string[]>(() => {
    return existing?.equiposAsignados || []
  })

  const [assignments, setAssignments] = useState<AsignacionesMap>(() => {
    if (savedDraft?.assignments) {
      return savedDraft.assignments
    }
    return createInitialAssignments(existing)
  })

  const initialValuesRef = useRef({
    form:
      savedDraft?.form ??
      (existing
        ? { ...existing }
        : initialFecha
          ? {
              ...createEmptyEventoForm(),
              hora_inicio: `${initialFecha}T19:00`,
              hora_fin: `${initialFecha}T23:59`,
            }
          : createEmptyEventoForm()),
    equiposAsignados: existing?.equiposAsignados || [],
    assignments: savedDraft?.assignments ?? createInitialAssignments(existing),
  })
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const formChanged =
      JSON.stringify(form) !== JSON.stringify(initialValuesRef.current.form)
    const equiposChanged =
      JSON.stringify(equiposAsignados) !==
      JSON.stringify(initialValuesRef.current.equiposAsignados)
    const assignChanged =
      JSON.stringify(assignments) !==
      JSON.stringify(initialValuesRef.current.assignments)
    setIsDirty(formChanged || equiposChanged || assignChanged)
  }, [form, equiposAsignados, assignments])

  const handleDiscard = () => {
    setForm(initialValuesRef.current.form)
    setEquiposAsignados(initialValuesRef.current.equiposAsignados)
    setAssignments(initialValuesRef.current.assignments)
    setIsDirty(false)
    toast.info("Cambios descartados")
  }

  const goBack = () => {
    clearEventoFormDraft()
    if (isFromDashboard) {
      navigate(ROUTE_PATHS.dashboard)
    } else {
      navigate(EVENTO_PATHS.list)
    }
  }

  const handleGoToCreateService = (initialName?: string) => {
    saveEventoFormDraft({
      form: { ...form, equiposAsignados },
      assignments,
      serviciosDetalles: form.serviciosDetalles,
      isEditing,
      returnUrl: location.pathname,
    })
    const basePath = isEditing
      ? EVENTO_PATHS.editServicio(id!)
      : EVENTO_PATHS.createServicio
    const query = initialName?.trim()
      ? `?nombre=${encodeURIComponent(initialName.trim())}`
      : ""
    navigate(`${basePath}${query}`)
  }

  const handleGoToCreateEmpleado = (initialName?: string) => {
    saveEventoFormDraft({
      form: { ...form, equiposAsignados },
      assignments,
      serviciosDetalles: form.serviciosDetalles,
      isEditing,
      returnUrl: location.pathname,
    })
    const basePath = isEditing
      ? EVENTO_PATHS.editEmpleado(id!)
      : EVENTO_PATHS.createEmpleado
    const query = initialName?.trim()
      ? `?nombre=${encodeURIComponent(initialName.trim())}`
      : ""
    navigate(`${basePath}${query}`)
  }

  if (isEditing && !existing) return <Navigate to={EVENTO_PATHS.list} replace />

  const executeSave = () => {
    const error = validateEventoForm(form, equiposAsignados, assignments)
    if (error) {
      toast.error(error)
      return
    }

    if (!isEditing) {
      const clienteEncontrado = CLIENTES_CATALOGO.find(
        (c) => c.id === form.cliente_id,
      )
      const newEvent: EventoItem = {
        id: `ev-${Date.now()}`,
        cliente_id: form.modalidad === "Propio" ? null : form.cliente_id,
        cliente_nombre:
          form.modalidad === "Propio"
            ? "The High Events"
            : clienteEncontrado?.nombre || "Cliente General",
        cotizacion_id: form.cotizacion_id || "",
        cotizacion_codigo: form.cotizacion_codigo || "",
        modalidad: form.modalidad,
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim(),
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        presupuesto_estimado: Number(form.presupuesto_estimado) || 0,
        estado: (form.estado as any) || "Planificación",
        fecha_creacion: new Date().toISOString().replace("T", " ").slice(0, 19),
        aforo_esperado: form.aforo_esperado || "200 personas",
        concepto_espectaculo: form.concepto_espectaculo || "",
        observaciones: form.observaciones || "",
        servicios: form.servicios || [],
        equiposAsignados,
        empleadosAsignados: Object.entries(assignments)
          .filter(([_, a]) => a.checked)
          .map(([empId, a]) => {
            const emp = AVAILABLE_EMPLOYEES.find((e) => e.id === empId)
            const tarea = TAREAS_CATALOGO.find((t) => t.id === a.tarea_id)
            return {
              empleado_id: empId,
              nombre: emp?.nombre || "Empleado",
              cargo: emp?.cargo || "Personal",
              fase: a.fase,
              tarea_id: a.tarea_id,
              tarea_nombre: tarea?.nombre_tarea || "Tarea",
            }
          }),
      }
      EVENTOS_MOCK.unshift(newEvent)
    }

    syncEventoTareasFromEvento(
      form.nombre?.trim() || "Evento Principal",
      form.hora_inicio,
      assignments,
    )
    clearEventoFormDraft()
    setIsDirty(false)
    toast.success(
      isEditing
        ? "Evento y tareas asignadas actualizados correctamente"
        : "Evento creado y tareas asignadas enviadas al tablero operativo",
    )
    navigate(EVENTO_PATHS.list)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSave()
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb superior */}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-4">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1.5 hover:text-[#F8FAFC] transition-colors cursor-pointer group"
          >
            <span>{isFromDashboard ? "Dashboard" : "Eventos"}</span>
          </button>
          <ChevronRight size={14} className="text-[#64748B]" />
          <span className="text-[#F8FAFC] font-medium">
            {isEditing ? "Editar evento" : "Crear evento"}
          </span>
        </div>

        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[26px] font-bold text-[#F8FAFC] tracking-tight">
              {isEditing ? "Editar evento" : "Crear un evento"}
            </h1>
            
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <EventoDatosSection form={form} setForm={setForm} />

          <EventoServiciosSection
            form={form}
            setForm={setForm}
            onGoToCreateService={handleGoToCreateService}
          />

          <EventoEquiposSection
            equiposAsignados={equiposAsignados}
            setEquiposAsignados={setEquiposAsignados}
          />

          <EventoStaffSection
            assignments={assignments}
            setAssignments={setAssignments}
            onGoToCreateEmpleado={handleGoToCreateEmpleado}
          />

          {/* Pie de acciones */}
          <div className="pt-6 border-t border-[#262D3D] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-[#F8FAFC] bg-[#181B22] border border-[#262D3D] hover:bg-[#222734] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{isEditing ? "Guardar cambios" : "Crear evento"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
