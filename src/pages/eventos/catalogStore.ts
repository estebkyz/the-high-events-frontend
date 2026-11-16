import type {
  AsignacionesMap,
  EventoFormValues,
  FaseTareaEvento,
} from "./types"
import { TAREAS_CATALOGO } from "./data"

export interface ServicioCatalogoItem {
  id: string; nombre: string
  categoria: string
  descripcion: string
  precioBase: string
}

export interface EmpleadoCatalogoItem {
  id: string; nombre: string
  cargo: string
  telefono?: string
  correo?: string
  tipo_documento?: string
  numero_documento?: string
}

export interface TareaCatalogoItem {
  id: string
  codigo: string
  nombre_tarea: string
  descripcion: string
  fase_sugerida: FaseTareaEvento
}

export interface ServicioDetalleEvento {
  id: string // id único del item en el evento
  servicio_catalogo_id?: string
  nombre: string
  categoria: string
  observaciones: string
  costo: string
}

const INITIAL_SERVICES_CATALOG: ServicioCatalogoItem[] = [
  {
    id: "s1",
    nombre: "Sonido Pro Line Array (hasta 1.000 pax)",
    categoria: "Sonido",
    descripcion:
      'Sistema de audio completo con arreglos colgados y subs de 18", ideal para eventos masivos al aire libre.',
    precioBase: "$ 4.500.000",
  },
  {
    id: "s2",
    nombre: "Sonido Compacto (hasta 300 pax)",
    categoria: "Sonido",
    descripcion:
      "Sistema JBL PRX con amplificación y consola digital de 32 canales para eventos medianos.",
    precioBase: "$ 1.800.000",
  },
  {
    id: "s3",
    nombre: "Show de Luces Robóticas Beam/Spot 350W",
    categoria: "Iluminación",
    descripcion:
      "8 cabezas móviles programadas DMX, hazer y control en tiempo real.",
    precioBase: "$ 3.200.000",
  },
  {
    id: "s4",
    nombre: "Iluminación Arquitectónica LED",
    categoria: "Iluminación",
    descripcion:
      "Wash LED RGBW para iluminación perimetral y decorativa de escenarios.",
    precioBase: "$ 1.400.000",
  },
  {
    id: "s5",
    nombre: "Pantalla LED P3.9 Outdoor (4×3 m)",
    categoria: "Pantallas",
    descripcion:
      "Pantalla modular de alta resolución con procesador Novastar y soporte 4K.",
    precioBase: "$ 5.000.000",
  },
  {
    id: "s6",
    nombre: "DJ Profesional + Set Pioneer CDJ-3000",
    categoria: "DJ",
    descripcion:
      "Show de DJ en vivo de hasta 6 horas con equipamiento Pioneer Nexus.",
    precioBase: "$ 1.800.000",
  },
  {
    id: "s7",
    nombre: "Cobertura Fotográfica Completa",
    categoria: "Fotografía",
    descripcion:
      "Fotógrafo profesional, edición en 48 horas y entrega digital de 500 fotos.",
    precioBase: "$ 2.200.000",
  },
  {
    id: "s8",
    nombre: "Producción de Video Cinema 4K",
    categoria: "Video",
    descripcion:
      "Cámaras 4K, estabilizadores, micrófonos inalámbricos y teaser post-evento.",
    precioBase: "$ 3.800.000",
  },
  {
    id: "s9",
    nombre: "Tarima & Escenografía Modular",
    categoria: "Escenografía",
    descripcion:
      "Estructura de truss Q30, tarima modular 8×6 m con acabado premium.",
    precioBase: "$ 6.200.000",
  },
  {
    id: "s10",
    nombre: "Coordinación Logística de Campo",
    categoria: "Logística",
    descripcion:
      "Personal de control de acceso, coordinación de tiempos y soporte general.",
    precioBase: "$ 1.500.000",
  },
]

const INITIAL_EMPLOYEES_CATALOG: EmpleadoCatalogoItem[] = [
  {
    id: "1",
    nombre: "Carlos Alberto Ruiz Montoya",
    cargo: "Ingeniero de Audio",
    telefono: "+57 312 9001122",
    correo: "cruiz@thehighevents.com",
  },
  {
    id: "2",
    nombre: "Andrés Felipe Vera Restrepo",
    cargo: "Técnico de Luces",
    telefono: "+57 320 8002233",
    correo: "avera@thehighevents.com",
  },
  {
    id: "3",
    nombre: "Sofía Elena Martínez Gómez",
    cargo: "Coordinadora Logística",
    telefono: "+57 300 7003344",
    correo: "smartinez@thehighevents.com",
  },
  {
    id: "4",
    nombre: "Felipe Santiago Gómez Vargas",
    cargo: "DJ Residente",
    telefono: "+57 315 6005566",
    correo: "fgomez@thehighevents.com",
  },
  {
    id: "5",
    nombre: "Valentina Lucía Torres Castaño",
    cargo: "Fotógrafa",
    telefono: "+57 311 4007788",
    correo: "vtorres@thehighevents.com",
  },
  {
    id: "6",
    nombre: "Mateo Alejandro Morales",
    cargo: "Director de Escenografía",
    telefono: "+57 318 2223344",
    correo: "mmorales@thehighevents.com",
  },
  {
    id: "7",
    nombre: "Daniela Restrepo Ríos",
    cargo: "Videógrafa",
    telefono: "+57 314 5556677",
    correo: "drestrepo@thehighevents.com",
  },
  {
    id: "8",
    nombre: "Juan Camilo Osorio",
    cargo: "Auxiliar de Montaje",
    telefono: "+57 313 8889900",
    correo: "josorio@thehighevents.com",
  },
]

const SERVICES_KEY = "high_events_servicios_catalogo"
const EMPLOYEES_KEY = "high_events_empleados_catalogo"
const TAREAS_KEY = "high_events_tareas_catalogo"
const DRAFT_KEY = "high_events_evento_form_draft"

export function getTareasCatalogo(): TareaCatalogoItem[] {
  try {
    const raw = sessionStorage.getItem(TAREAS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return TAREAS_CATALOGO
}

export function addTareaCatalogo(
  item: Omit<TareaCatalogoItem, "id" | "codigo"> & { id?: string; codigo?: string },
): TareaCatalogoItem {
  const current = getTareasCatalogo()
  const nextNumber = current.length + 1
  const newItem: TareaCatalogoItem = {
    id: item.id || String(Date.now()),
    codigo: item.codigo || `TAR-${String(nextNumber).padStart(3, "0")}`,
    nombre_tarea: item.nombre_tarea.trim(),
    descripcion:
      item.descripcion?.trim() ||
      "Actividad operativa estándar asignable a eventos.",
    fase_sugerida: item.fase_sugerida || "Montaje",
  }
  const updated = [newItem, ...current]
  try {
    sessionStorage.setItem(TAREAS_KEY, JSON.stringify(updated))
  } catch {
    // fallback
  }
  return newItem
}

export function updateTareaCatalogo(
  id: string,
  changes: Partial<Omit<TareaCatalogoItem, "id">>,
): TareaCatalogoItem[] {
  const current = getTareasCatalogo()
  const updated = current.map((t) => (t.id === id ? { ...t, ...changes } : t))
  try {
    sessionStorage.setItem(TAREAS_KEY, JSON.stringify(updated))
  } catch {
    // fallback
  }
  return updated
}

export function deleteTareaCatalogo(id: string): TareaCatalogoItem[] {
  const current = getTareasCatalogo()
  const updated = current.filter((t) => t.id !== id)
  try {
    sessionStorage.setItem(TAREAS_KEY, JSON.stringify(updated))
  } catch {
    // fallback
  }
  return updated
}

export function getServiciosCatalogo(): ServicioCatalogoItem[] {
  try {
    const raw = sessionStorage.getItem(SERVICES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return INITIAL_SERVICES_CATALOG
}

export function addServicioCatalogo(
  item: Omit<ServicioCatalogoItem, "id"> & { id?: string },
): ServicioCatalogoItem {
  const current = getServiciosCatalogo()
  const newItem: ServicioCatalogoItem = {
    id: item.id || `s_${Date.now()}`,
    nombre: item.nombre,
    categoria: item.categoria,
    descripcion: item.descripcion,
    precioBase: item.precioBase,
  }
  const updated = [newItem, ...current]
  try {
    sessionStorage.setItem(SERVICES_KEY, JSON.stringify(updated))
  } catch {
    // fallback
  }
  return newItem
}

export function getEmpleadosCatalogo(): EmpleadoCatalogoItem[] {
  try {
    const raw = sessionStorage.getItem(EMPLOYEES_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return INITIAL_EMPLOYEES_CATALOG
}

export function addEmpleadoCatalogo(
  item: Omit<EmpleadoCatalogoItem, "id"> & { id?: string },
): EmpleadoCatalogoItem {
  const current = getEmpleadosCatalogo()
  const newItem: EmpleadoCatalogoItem = {
    id: item.id || `emp_${Date.now()}`,
    nombre: item.nombre,
    cargo: item.cargo,
    telefono: item.telefono,
    correo: item.correo,
    tipo_documento: item.tipo_documento,
    numero_documento: item.numero_documento,
  }
  const updated = [newItem, ...current]
  try {
    sessionStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated))
  } catch {
    // fallback
  }
  return newItem
}

export interface EventoDraftData {
  form: EventoFormValues; assignments: AsignacionesMap
  serviciosDetalles?: ServicioDetalleEvento[]
  returnUrl?: string
  isEditing?: boolean
}

export function saveEventoFormDraft(data: EventoDraftData): void {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export function loadEventoFormDraft(): EventoDraftData | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearEventoFormDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_KEY)
  } catch {
    // ignore
  }
}

/** Añade un servicio recién creado directamente al borrador del evento */
export function addServicioToDraft(nuevoServicio: ServicioCatalogoItem): void {
  const draft = loadEventoFormDraft()
  if (!draft) return

  const currentServicios = draft.form.servicios || []
  if (!currentServicios.includes(nuevoServicio.nombre)) {
    draft.form.servicios = [...currentServicios, nuevoServicio.nombre]
  }

  const detalles = draft.serviciosDetalles || []
  detalles.push({
    id: `det_${Date.now()}`,
    servicio_catalogo_id: nuevoServicio.id,
    nombre: nuevoServicio.nombre,
    categoria: nuevoServicio.categoria,
    observaciones: nuevoServicio.descripcion || "",
    costo: nuevoServicio.precioBase || "$ 0",
  })
  draft.serviciosDetalles = detalles

  saveEventoFormDraft(draft)
}

/** Añade un empleado recién creado directamente a las asignaciones del borrador */
export function addEmpleadoToDraft(
  nuevoEmpleado: EmpleadoCatalogoItem,
  tareaId?: string,
  fase?: FaseTareaEvento,
): void {
  const draft = loadEventoFormDraft()
  if (!draft) return

  draft.assignments = {
    ...draft.assignments,
    [nuevoEmpleado.id]: {
      checked: true,
      tarea_id: tareaId || TAREAS_CATALOGO[0].id,
      fase: fase || "Montaje",
    },
  }

  saveEventoFormDraft(draft)
}
