import { useCategoryCatalog } from "@/hooks/useCategoryCatalog"
import { useCrudResource } from "@/hooks/useCrudResource"
import type { ClienteItem } from "@/pages/clientes/types"
import type { CotizacionItem } from "@/pages/cotizaciones/types"
import type { EmpleadoItem } from "@/pages/empleados/types"
import type { EquipoItem } from "@/pages/equipos/types"
import type { ProveedorItem } from "@/pages/proveedores/types"
import type { ServicioItem } from "@/pages/servicios/types"
import type { TareaCatalogoItem } from "@/pages/tareas/types"

/** Catálogos que necesita el formulario de evento. */
export function useEventoCatalogs() {
  return {
    clientes: useCrudResource<ClienteItem>({ endpoint: "/clientes" }),
    cotizaciones: useCrudResource<CotizacionItem>({ endpoint: "/cotizaciones" }),
    servicios: useCrudResource<ServicioItem>({ endpoint: "/servicios" }),
    categorias: useCategoryCatalog("/categorias-servicio"),
    proveedores: useCrudResource<ProveedorItem>({ endpoint: "/proveedores" }),
    equipos: useCrudResource<EquipoItem>({ endpoint: "/equipos" }),
    empleados: useCrudResource<EmpleadoItem>({ endpoint: "/empleados" }),
    tareas: useCrudResource<TareaCatalogoItem>({ endpoint: "/tareas-catalogo" }),
  }
}

export type EventoCatalogs = ReturnType<typeof useEventoCatalogs>
