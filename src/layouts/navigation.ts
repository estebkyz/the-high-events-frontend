import {
  AlertTriangle,
  Boxes,
  CalendarDays,
  CheckSquare,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck,
  FileText,
  Home,
  Layers,
  Repeat,
  ShieldCheck,
  Truck,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import { MODULE_ACCESS } from "@/constants/access"
import type { RouteId } from "@/types"

export interface NavItem {
  label: string
  icon: LucideIcon
  route: RouteId
}

export interface NavSection {
  title: string
  items: NavItem[]
}

export const NAV_HOME: NavItem = {
  label: "Dashboard",
  icon: Home,
  route: "dashboard",
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Eventos",
    items: [
      { label: "Cotizaciones", icon: FileText, route: "cotizaciones" },
      { label: "Eventos", icon: CalendarDays, route: "eventos" },
      { label: "Agendamiento", icon: Clock, route: "agendamiento" },
    ],
  },
  {
    title: "Comercial y ventas",
    items: [
      { label: "Clientes", icon: Users, route: "clientes" },
      { label: "Servicios", icon: Layers, route: "servicios" },
      { label: "Ventas", icon: DollarSign, route: "ventas" },
      { label: "Abonos", icon: CreditCard, route: "abonos" },
    ],
  },
  {
    title: "Operación y logística",
    items: [
      { label: "Tareas", icon: CheckSquare, route: "tareas" },
      { label: "Equipos", icon: Boxes, route: "equipos" },
      { label: "Préstamos", icon: Repeat, route: "prestamos" },
      { label: "Recepciones", icon: FileCheck, route: "recepciones" },
      { label: "Incidentes", icon: AlertTriangle, route: "incidentes" },
    ],
  },
  {
    title: "Proveedores",
    items: [{ label: "Proveedores", icon: Truck, route: "proveedores" }],
  },
  {
    title: "Configuración",
    items: [
      { label: "Empleados", icon: UserCheck, route: "empleados" },
      { label: "Usuarios", icon: User, route: "usuarios" },
      { label: "Roles", icon: ShieldCheck, route: "roles" },
    ],
  },
]

type Can = (codes: readonly string[]) => boolean

/** Menú de la persona: solo los módulos que puede ver. */
export function allowedNavigation(can: Can) {
  const isAllowed = ({ route }: NavItem) => can(MODULE_ACCESS[route].view)
  return {
    home: isAllowed(NAV_HOME) ? NAV_HOME : null,
    sections: NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(isAllowed),
    })).filter((section) => section.items.length > 0),
  }
}

export function firstAllowedRoute(can: Can): RouteId {
  const { home, sections } = allowedNavigation(can)
  return (home ?? sections[0]?.items[0] ?? NAV_HOME).route
}
