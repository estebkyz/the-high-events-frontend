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
  Layers,
  Repeat,
  Settings,
  ShieldCheck,
  Truck,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { RouteId } from "@/types"

export interface NavItem {
  label: string
  icon: LucideIcon
  route: RouteId
}

export interface NavSection {
  title: string
  icon: LucideIcon
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Eventos",
    icon: CalendarDays,
    items: [
      { label: "Cotizaciones", icon: FileText, route: "cotizaciones" },
      { label: "Eventos", icon: CalendarDays, route: "eventos" },
      { label: "Agendamiento", icon: Clock, route: "agendamiento" },
    ],
  },
  {
    title: "Comercial y ventas",
    icon: DollarSign,
    items: [
      { label: "Clientes", icon: Users, route: "clientes" },
      { label: "Servicios", icon: Layers, route: "servicios" },
      { label: "Ventas", icon: DollarSign, route: "ventas" },
      { label: "Abonos", icon: CreditCard, route: "abonos" },
    ],
  },
  {
    title: "Operación y logística",
    icon: Boxes,
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
    icon: Truck,
    items: [{ label: "Proveedores", icon: Truck, route: "proveedores" }],
  },
  {
    title: "Configuración",
    icon: Settings,
    items: [
      { label: "Empleados", icon: UserCheck, route: "empleados" },
      { label: "Usuarios", icon: User, route: "usuarios" },
      { label: "Roles", icon: ShieldCheck, route: "roles" },
    ],
  },
]
