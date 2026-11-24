import type { EstadoActivo } from "@/constants/common"

export type RouteId =
  | "dashboard"
  | "eventos"
  | "agendamiento"
  | "tareas"
  | "equipos"
  | "prestamos"
  | "incidentes"
  | "clientes"
  | "cotizaciones"
  | "ventas"
  | "abonos"
  | "proveedores"
  | "recepciones"
  | "servicios"
  | "empleados"
  | "usuarios"
  | "roles"

/** Catálogo de categorías (`categorias_servicio`, `categorias_equipo`). */
export interface CategoriaItem {
  id: string
  nombre: string
  descripcion: string
  estado: EstadoActivo
}
