import type { TareaItem, Prioridad, EstadoTarea, Fase } from "./types"
import type { AsignacionesMap } from "../eventos/types"
import { getEmpleadosCatalogo, getTareasCatalogo } from "../eventos/catalogStore"

export const INITIAL_TASKS: TareaItem[] = [
  {
    id: "1",
    tarea_id: "1",
    codigo_tarea: "TAR-001",
    tarea: "Montaje de Line Array y Subwoofers",
    descripcion_catalogo:
      "Instalación de arreglos lineales, colgado en estructuras truss, conexionado de potencia y verificación de cobertura acústica.",
    fase: "Montaje",
    responsable: "Carlos Alberto Ruiz Montoya",
    responsable_id: "1",
    cargo_responsable: "Ingeniero de Audio",
    evento: "Festival de Música 360",
    evento_id: "1",
    prioridad: "Alta",
    fechaLimite: "2026-11-01",
    hora_inicio_estimada: "08:00",
    hora_fin_estimada: "13:00",
    estado: "Completada",
    notas: "Arreglo principal colgado a 6.5 metros. Verificado SPL en zona VIP y fosa.",
  },
  {
    id: "2",
    tarea_id: "4",
    codigo_tarea: "TAR-004",
    tarea: "Prueba de Sonido y Mezcla en Vivo",
    descripcion_catalogo:
      "Line check, ecualización de sala, ajuste de monitores/in-ears y calibración de niveles SPL con artistas o DJ.",
    fase: "Montaje",
    responsable: "Felipe Santiago Gómez Vargas",
    responsable_id: "4",
    cargo_responsable: "DJ Residente",
    evento: "Festival de Música 360",
    evento_id: "1",
    prioridad: "Alta",
    fechaLimite: "2026-11-01",
    hora_inicio_estimada: "14:00",
    hora_fin_estimada: "17:00",
    estado: "En Proceso",
    notas: "Calibrando retorno de cabina Pioneer CDJ-3000 y corte de subbajos.",
  },
  {
    id: "3",
    tarea_id: "3",
    codigo_tarea: "TAR-003",
    tarea: "Coordinación Logística y Rigging",
    descripcion_catalogo:
      "Supervisión de descargue en muelle, anclaje seguro de motores/polipastos y distribución de puntos eléctricos.",
    fase: "Montaje",
    responsable: "Sofía Elena Martínez Gómez",
    responsable_id: "3",
    cargo_responsable: "Coordinadora Logística",
    evento: "Boda & Prom San José",
    evento_id: "2",
    prioridad: "Alta",
    fechaLimite: "2026-10-25",
    hora_inicio_estimada: "08:00",
    hora_fin_estimada: "13:00",
    estado: "En Proceso",
    notas: "Confirmado plano de rigging y planta eléctrica de respaldo en Hacienda El Castillo.",
  },
  {
    id: "4",
    tarea_id: "2",
    codigo_tarea: "TAR-002",
    tarea: "Programación DMX y Cabezas Móviles",
    descripcion_catalogo:
      "Direccionamiento de universos DMX, parcheo en consola de iluminación y creación de escenas base del espectáculo.",
    fase: "Montaje",
    responsable: "Andrés Felipe Vera Restrepo",
    responsable_id: "2",
    cargo_responsable: "Técnico de Luces",
    evento: "Quinceañera Familia Rodríguez",
    evento_id: "4",
    prioridad: "Alta",
    fechaLimite: "2026-11-20",
    hora_inicio_estimada: "10:00",
    hora_fin_estimada: "15:00",
    estado: "Pendiente",
    notas: "Programar timecode para show de luces Neon y pista LED 5x5m.",
  },
  {
    id: "5",
    tarea_id: "7",
    codigo_tarea: "TAR-007",
    tarea: "Revisión de Micrófonos Inalámbricos y RF",
    descripcion_catalogo:
      "Escaneo de frecuencias libres de interferencia, pruebas de cápsulas y reemplazo preventivo de baterías.",
    fase: "Planificación",
    responsable: "Carlos Alberto Ruiz Montoya",
    responsable_id: "1",
    cargo_responsable: "Ingeniero de Audio",
    evento: "Gala Anual Corporativa Norte",
    evento_id: "3",
    prioridad: "Media",
    fechaLimite: "2026-11-12",
    hora_inicio_estimada: "11:00",
    hora_fin_estimada: "13:30",
    estado: "Completada",
    notas: "Bandas UHF sincronizadas y baterías AA recargables al 100% para los 4 kits Shure.",
  },
  {
    id: "6",
    tarea_id: "5",
    codigo_tarea: "TAR-005",
    tarea: "Operación de Visuales y Pantallas LED",
    descripcion_catalogo:
      "Configuración de procesador Novastar, mapeo de resoluciones 4K y disparo de contenido visual en vivo.",
    fase: "Montaje",
    responsable: "Andrés Felipe Vera Restrepo",
    responsable_id: "2",
    cargo_responsable: "Técnico de Luces",
    evento: "Lanzamiento Anual TechCorp",
    evento_id: "5",
    prioridad: "Alta",
    fechaLimite: "2026-12-03",
    hora_inicio_estimada: "06:30",
    hora_fin_estimada: "08:30",
    estado: "Pendiente",
    notas: "A la espera de que el proveedor externo entregue las tarjetas receptoras del procesador Novastar.",
  },
  {
    id: "7",
    tarea_id: "6",
    codigo_tarea: "TAR-006",
    tarea: "Desmontaje y Cierre de Bodega",
    descripcion_catalogo:
      "Desconexión segura de equipos, embalaje en flight cases, conteo físico contra acta y retorno a bodega.",
    fase: "Desmontaje",
    responsable: "Sofía Elena Martínez Gómez",
    responsable_id: "3",
    cargo_responsable: "Coordinadora Logística",
    evento: "Boda & Prom San José",
    evento_id: "2",
    prioridad: "Media",
    fechaLimite: "2026-10-26",
    hora_inicio_estimada: "03:00",
    hora_fin_estimada: "06:00",
    estado: "Pendiente",
    notas: "Verificar Formato Digital de Recepción de Equipos antes de despachar camión.",
  },
  {
    id: "8",
    tarea_id: "8",
    codigo_tarea: "TAR-008",
    tarea: "Calibración de Iluminación Arquitectónica",
    descripcion_catalogo:
      "Ajuste cromático de pares LED y bañadores perimetrales según el concepto visual del evento.",
    fase: "Ejecución",
    responsable: "Valentina Lucía Torres Castaño",
    responsable_id: "5",
    cargo_responsable: "Fotógrafa",
    evento: "Gala Anual Corporativa Norte",
    evento_id: "3",
    prioridad: "Media",
    fechaLimite: "2026-11-12",
    hora_inicio_estimada: "16:00",
    hora_fin_estimada: "18:00",
    estado: "En Proceso",
    notas: "Ajustando temperatura de color (CRI) para fotografía y circuito cerrado en salón principal.",
  },
]

const EVENTO_TAREAS_KEY = "high_events_evento_tareas_store"

export function getEventoTareasStore(): TareaItem[] {
  try {
    const raw = sessionStorage.getItem(EVENTO_TAREAS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return INITIAL_TASKS
}

export function saveEventoTareasStore(tasks: TareaItem[]): void {
  try {
    sessionStorage.setItem(EVENTO_TAREAS_KEY, JSON.stringify(tasks))
  } catch {
    // ignore
  }
}

function normalizeFase(faseEvento: string): Fase {
  if (
    faseEvento === "Planificación" ||
    faseEvento === "Montaje" ||
    faseEvento === "Ejecución" ||
    faseEvento === "Desmontaje"
  ) {
    return faseEvento
  }
  return "Montaje"
}

/**
 * Sincroniza las tareas asignadas al crear o editar un Evento (`EventoFormPage`)
 * con la tabla operativa `evento_tarea` mostrada en `TareasPage`.
 */
export function syncEventoTareasFromEvento(
  eventoNombre: string,
  horaInicioEvento: string | undefined,
  assignments: AsignacionesMap,
): void {
  const currentTasks = getEventoTareasStore()
  const empleadosCatalog = getEmpleadosCatalogo()
  const tareasCatalog = getTareasCatalogo()
  const fechaEvento = horaInicioEvento
    ? horaInicioEvento.split("T")[0]
    : new Date().toISOString().split("T")[0]

  const assignedEntries = Object.entries(assignments).filter(
    ([, sel]) => sel.checked,
  )

  const newEventoTareas: TareaItem[] = assignedEntries.map(([empId, sel], idx) => {
    const emp = empleadosCatalog.find((e) => e.id === empId)
    const tareaCat =
      tareasCatalog.find((t) => t.id === sel.tarea_id) || tareasCatalog[0]

    // Preservar estado si ya existía esta asignación para este evento y empleado
    const existingTask = currentTasks.find(
      (ct) =>
        ct.evento === eventoNombre &&
        (String(ct.responsable_id) === empId || ct.responsable === emp?.nombre),
    )

    return {
      id: existingTask?.id || `et_${Date.now()}_${idx}`,
      tarea_id: tareaCat?.id || sel.tarea_id,
      codigo_tarea: tareaCat?.codigo || "TAR-001",
      tarea: tareaCat?.nombre_tarea || "Montaje de Line Array y Subwoofers",
      descripcion_catalogo: tareaCat?.descripcion,
      fase: normalizeFase(sel.fase),
      responsable: emp?.nombre || "Personal Técnico",
      responsable_id: empId,
      cargo_responsable: emp?.cargo || "Técnico",
      evento: eventoNombre,
      prioridad: existingTask?.prioridad || "Alta",
      fechaLimite: fechaEvento,
      hora_inicio_estimada: existingTask?.hora_inicio_estimada || "08:00",
      hora_fin_estimada: existingTask?.hora_fin_estimada || "14:00",
      estado: existingTask?.estado || "Pendiente",
      notas:
        existingTask?.notas ||
        tareaCat?.descripcion ||
        "Asignada desde la orden de producción del evento.",
    }
  })

  // Mantener tareas de otros eventos y reemplazar/insertar las de este evento
  const otherEventTasks = currentTasks.filter((t) => t.evento !== eventoNombre)
  saveEventoTareasStore([...newEventoTareas, ...otherEventTasks])
}

export const PRIORIDAD_DOT: Record<Prioridad, string> = {
  Alta: "bg-[#EF4444]",
  Media: "bg-[#F59E0B]",
  Baja: "bg-[#10B981]",
}

export const KANBAN_HEADER_COLORS: Record<EstadoTarea, string> = {
  Pendiente: "text-[#F59E0B]",
  "En Proceso": "text-[#3B82F6]",
  Completada: "text-[#10B981]",
}

export const KANBAN_BORDER_COLORS: Record<EstadoTarea, string> = {
  Pendiente: "border-[#F59E0B]/30",
  "En Proceso": "border-[#3B82F6]/30",
  Completada: "border-[#10B981]/30",
}

export const FASE_OPTIONS: { label: string; value: Fase }[] = [
  { label: "Planificación", value: "Planificación" },
  { label: "Montaje", value: "Montaje" },
  { label: "Ejecución", value: "Ejecución" },
  { label: "Desmontaje", value: "Desmontaje" },
]

export const PRIORIDAD_OPTIONS: { label: string; value: Prioridad }[] = [
  { label: "Alta", value: "Alta" },
  { label: "Media", value: "Media" },
  { label: "Baja", value: "Baja" },
]
