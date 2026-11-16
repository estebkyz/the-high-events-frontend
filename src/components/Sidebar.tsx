import React, { useState, useEffect, useRef } from "react"
import {
  LayoutGrid,
  CalendarDays,
  Clock,
  Users,
  Layers,
  FileText,
  DollarSign,
  CreditCard,
  Boxes,
  CheckSquare,
  Repeat,
  FileCheck,
  AlertTriangle,
  Truck,
  UserCheck,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  LogOut,
  X,
  Settings,
} from "lucide-react"
import type { RouteId } from "../types"
import { useAuth } from "../context/AuthContext"

export interface NavItem {
  label: string
  icon: React.ElementType
  route: RouteId
}

export interface NavSection {
  title: string
  icon: React.ElementType
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Eventos",
    icon: CalendarDays,
    items: [
      { label: "Eventos", icon: CalendarDays, route: "eventos" },
      { label: "Agendamiento", icon: Clock, route: "agendamiento" },
    ],
  },
  {
    title: "Comercial y Ventas",
    icon: DollarSign,
    items: [
      { label: "Clientes", icon: Users, route: "clientes" },
      { label: "Servicios", icon: Layers, route: "servicios" },
      { label: "Cotizaciones", icon: FileText, route: "cotizaciones" },
      { label: "Ventas", icon: DollarSign, route: "ventas" },
      { label: "Abonos", icon: CreditCard, route: "abonos" },
    ],
  },
  {
    title: "Operación y Logística",
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
    items: [
      { label: "Proveedores", icon: Truck, route: "proveedores" },
    ],
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

interface SidebarProps {
  active: RouteId
  onNavigate: (route: RouteId) => void
  onLogout?: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
  isDesktopVisible?: boolean
}

export default function Sidebar({
  active: currentRoute,
  onNavigate,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
  isDesktopVisible = true,
}: SidebarProps) {
  const { user } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Estado del acordeón por sección (todas abiertas por defecto según el diseño original)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Eventos": true,
    "Comercial y Ventas": true,
    "Operación y Logística": true,
    "Proveedores": true,
    "Configuración": true,
  })

  // Cierra el menú de usuario al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  // Asegura que la sección que contiene la ruta activa esté siempre desplegada
  useEffect(() => {
    NAV_SECTIONS.forEach((section) => {
      if (section.items.some((item) => item.route === currentRoute)) {
        setOpenSections((prev) => ({ ...prev, [section.title]: true }))
      }
    })
  }, [currentRoute])

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const handleItemClick = (route: RouteId) => {
    onNavigate(route)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <>
      {/* Backdrop para dispositivos móviles */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[260px] md:w-[240px] shrink-0 bg-white dark:bg-[#111318] border-r border-[#CBD5E1] dark:border-[#2D3748] flex flex-col h-screen select-none transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } ${!isDesktopVisible ? "md:hidden" : ""}`}
      >
        {/* Cabecera superior con marca: The High Events (visible en desktop y móvil) */}
        <div className="px-4 py-4 border-b border-[#CBD5E1] dark:border-[#2D3748] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center font-bold text-white text-xs shadow-md shadow-[#7C3AED]/30">
              TH
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A] dark:text-[#F1F5F9] leading-tight tracking-tight">The High</p>
              <p className="text-[10px] text-[#6D28D9] dark:text-[#A78BFA] font-bold leading-tight tracking-widest uppercase">Events</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Cerrar menú lateral"
              className="md:hidden p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:text-[#94A3B8] dark:hover:text-[#F1F5F9] dark:hover:bg-[#1E232D] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Árbol de navegación con scroll */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Dashboard superior directo */}
          <button
            type="button"
            onClick={() => handleItemClick("dashboard")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] transition-all text-left cursor-pointer ${
              currentRoute === "dashboard"
                ? "bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#7C3AED]/20 dark:text-[#C4B5FD] font-semibold shadow-xs"
                : "text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E232D] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] font-medium"
            }`}
          >
            <LayoutGrid
              size={18}
              className={
                currentRoute === "dashboard"
                  ? "text-[#6D28D9] dark:text-[#C4B5FD] shrink-0"
                  : "text-[#475569] dark:text-[#94A3B8] shrink-0"
              }
            />
            <span className="truncate">Dashboard</span>
          </button>

          {/* Línea divisoria sutil bajo Dashboard */}
          <div className="h-px bg-[#CBD5E1] dark:bg-[#2D3748] my-2 mx-1" />

          {/* Secciones acordeón agrupadas */}
          <div className="space-y-1.5 pt-1">
            {NAV_SECTIONS.map((section) => {
              const isOpen = openSections[section.title] ?? true
              const hasActiveChild = section.items.some((item) => item.route === currentRoute)
              const SectionIcon = section.icon

              return (
                <div key={section.title} className="space-y-0.5">
                  {/* Encabezado del acordeón */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors hover:bg-[#F1F5F9] dark:hover:bg-[#1A1D23] group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <SectionIcon
                        size={18}
                        className={
                          hasActiveChild
                            ? "text-[#6D28D9] dark:text-[#A78BFA] shrink-0"
                            : "text-[#334155] dark:text-[#94A3B8] shrink-0 group-hover:text-[#0F172A] dark:group-hover:text-white"
                        }
                      />
                      <span className="text-[13.5px] font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-[#475569] dark:text-[#94A3B8] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-0" : "-rotate-90"
                      }`}
                    />
                  </button>

                  {/* Submódulos con línea guía vertical tipo árbol */}
                  {isOpen && (
                    <div className="relative pl-2.5 ml-4.5 my-0.5 space-y-1 border-l border-[#CBD5E1] dark:border-[#2D3748]">
                      {section.items.map((item) => {
                        const isActive = currentRoute === item.route
                        const ItemIcon = item.icon

                        return (
                          <button
                            key={item.route}
                            type="button"
                            onClick={() => handleItemClick(item.route)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-all text-left cursor-pointer ${
                              isActive
                                ? "bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#7C3AED]/20 dark:text-[#C4B5FD] font-semibold shadow-xs"
                                : "text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E232D] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] font-medium"
                            }`}
                          >
                            <ItemIcon
                              size={17}
                              className={
                                isActive
                                  ? "text-[#6D28D9] dark:text-[#C4B5FD] shrink-0"
                                  : "text-[#475569] dark:text-[#94A3B8] shrink-0"
                              }
                            />
                            <span className="truncate">{item.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Footer con correo del usuario logueado y modal de sesión */}
        <div className="relative p-3 border-t border-[#CBD5E1] dark:border-[#2D3748] bg-white dark:bg-[#111318] shrink-0">
          {/* Modal pequeño flotante hacia arriba con nombre, correo y cerrar sesión */}
          {isUserMenuOpen && (
            <div
              ref={userMenuRef}
              className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#1A1D23] border border-[#CBD5E1] dark:border-[#2D3748] rounded-xl shadow-xl p-3 z-50 animate-fade-in space-y-2.5"
            >
              <div>
                <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate leading-tight">
                  {user?.name || "Esteban D"}
                </p>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] truncate leading-tight mt-0.5">
                  {user?.email || "juanestebancasta2007@gmail.com"}
                </p>
              </div>
              <div className="h-px bg-[#CBD5E1] dark:bg-[#2D3748]" />
              <button
                type="button"
                onClick={() => {
                  setIsUserMenuOpen(false)
                  if (onLogout) onLogout()
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium text-[#334155] dark:text-[#CBD5E1] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors text-left cursor-pointer"
              >
                <LogOut size={14} className="shrink-0" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}

          {/* Botón inferior con el correo y la flecha arriba */}
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="w-full flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#F1F5F9] dark:hover:bg-[#1A1D23] transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate leading-tight mt-0.5">
              {"Esteban D"}
            </span>
            <ChevronUp
              size={15}
              className={`text-[#334155] dark:text-[#CBD5E1] shrink-0 transition-transform duration-150 ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  )
}
