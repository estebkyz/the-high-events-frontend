import React, { useMemo, useState } from "react"
import {
  MapPin,
  X,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { useToast } from "../../components/Toast"
import type { SelectOption } from "../../components/CustomSelect"
import {
  INITIAL_EVENTS,
  INITIAL_LOCATIONS,
  MESES_NOMBRES,
  TODAY_YEAR,
  TODAY_MONTH,
  TODAY_DAY,
} from "./data"
import {
  FILTROS_ESTADO,
  coincideEstado,
  formatToISODate,
  getDaysInMonth,
  getEstadoColor,
  getEstadoMeta,
  getStartDayOfWeek,
  labelFiltroEstado,
  parseDateISO,
} from "./utils"
import { AgendamientoCalendar } from "./components/AgendamientoCalendar"
import { AgendamientoDetailDrawer } from "./drawers/AgendamientoDetailDrawer"
import { AgendamientoFormDrawer } from "./drawers/AgendamientoFormDrawer"
import type {
  AgendaEvent,
  AgendaFormData,
  AgendaKind,
  TipoAgendamiento,
  DrawerMode,
  FilterKind,
} from "./types"

const KIND_OPTIONS: { label: string; value: FilterKind }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Eventos", value: "evento" },
  { label: "Visitas", value: "visita_tecnica" },
  { label: "Reuniones", value: "reunion_cliente" },
  { label: "Otros", value: "otro" },
]

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/70"

export default function AgendamientoPage() {
  const toast = useToast()

  const [events, setEvents] = useState<AgendaEvent[]>(INITIAL_EVENTS)
  const [currentYear, setCurrentYear] = useState(TODAY_YEAR)
  const [currentMonth, setCurrentMonth] = useState(TODAY_MONTH)
  const [selectedDay, setSelectedDay] = useState<number>(TODAY_DAY)

  // Search & Filters
  const [search, setSearch] = useState("")
  const [filterKind, setFilterKind] = useState<FilterKind>("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")
  const [filterVenue, setFilterVenue] = useState<string | null>(null)
  const [sidebarScope, setSidebarScope] = useState<"day" | "all">("all")

  // Drawers
  const [drawerMode, setDrawerMode] = useState<DrawerMode>("none")
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null)

  const [formData, setFormData] = useState<AgendaFormData>({
    kind: "evento",
    tipo_agendamiento: "evento",
    title: "",
    client: "",
    time: "10:00",
    dateISO: formatToISODate(TODAY_YEAR, TODAY_MONTH, TODAY_DAY),
    type: "Reserva de Evento",
    estado: "Pendiente",
    venue: "Salón Principal 360",
    modalidadCita: "Videollamada (Meet / Zoom)",
    notas: "",
  })

  // Catálogos dinámicos
  const [customClients, setCustomClients] = useState<string[]>([])
  const [customVenues, setCustomVenues] = useState<string[]>([])

  const clientOptions = useMemo<SelectOption[]>(() => {
    const set = new Set<string>([
      ...events.map((e) => e.client),
      ...customClients,
    ])
    return Array.from(set)
      .filter(Boolean)
      .map((c) => ({ label: c, value: c }))
  }, [events, customClients])

  const venueOptions = useMemo<SelectOption[]>(() => {
    const base = INITIAL_LOCATIONS.map((loc) => ({
      label: loc.name,
      value: loc.name,
      sublabel: `Capacidad: ${loc.capacity}`,
    }))
    const extras = customVenues
      .filter((v) => !INITIAL_LOCATIONS.some((l) => l.name === v))
      .map((v) => ({ label: v, value: v, sublabel: "Locación personalizada" }))
    return [...base, ...extras]
  }, [customVenues])

  // Cálculos de calendario
  const daysInMonth = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth],
  )
  const startDayOfWeek = useMemo(
    () => getStartDayOfWeek(currentYear, currentMonth),
    [currentYear, currentMonth],
  )
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  )

  // Eventos filtrados del mes
  const filteredMonthEvents = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((ev) => {
      if (ev.year !== currentYear || ev.month !== currentMonth) return false
      const matchKind =
        filterKind === "Todos" ||
        ev.tipo_agendamiento === filterKind ||
        ev.kind === filterKind ||
        (filterKind === "reunion_cliente" && ev.kind === "cita") ||
        (filterKind === "evento" && ev.kind === "evento")
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.client.toLowerCase().includes(q) ||
        (ev.venue && ev.venue.toLowerCase().includes(q)) ||
        (ev.modalidadCita && ev.modalidadCita.toLowerCase().includes(q))
      const matchEstado = coincideEstado(ev, filterEstado)
      const matchVenue =
        !filterVenue || (ev.venue === filterVenue)
      return matchKind && matchSearch && matchEstado && matchVenue
    })
  }, [
    events,
    currentYear,
    currentMonth,
    filterKind,
    search,
    filterEstado,
    filterVenue,
  ])

  // Mapa día -> eventos
  const eventsByDay = useMemo(() => {
    const map: Record<number, AgendaEvent[]> = {}
    filteredMonthEvents.forEach((ev) => {
      if (!map[ev.day]) map[ev.day] = []
      map[ev.day].push(ev)
    })
    return map
  }, [filteredMonthEvents])

  const selectedDayEvents = useMemo(
    () => eventsByDay[selectedDay] || [],
    [eventsByDay, selectedDay],
  )

  // Acciones sobre eventos para el Drawer de Detalle
  const handleConfirmItem = (id: string) => {
    const target = events.find((ev) => ev.id === id)
    if (!target) return
    const nextEstado = "Confirmado"
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? { ...ev, estado: nextEstado, color: getEstadoColor(nextEstado) }
          : ev,
      ),
    )
    if (selectedEvent?.id === id) {
      setSelectedEvent((prev) =>
        prev
          ? { ...prev, estado: nextEstado, color: getEstadoColor(nextEstado) }
          : prev,
      )
    }
    toast.success(`"${target.title}" confirmado`)
  }

  const handleCancelItem = (id: string) => {
    const target = events.find((ev) => ev.id === id)
    if (!target) return
    const nextEstado = "Cancelado"
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id
          ? { ...ev, estado: nextEstado, color: getEstadoColor(nextEstado) }
          : ev,
      ),
    )
    if (selectedEvent?.id === id) {
      setSelectedEvent((prev) =>
        prev
          ? { ...prev, estado: nextEstado, color: getEstadoColor(nextEstado) }
          : prev,
      )
    }
    toast.info(`"${target.title}" cancelado`)
  }

  // Navegación de mes
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1)
      setCurrentMonth(11)
    } else {
      setCurrentMonth((m) => m - 1)
    }
    setSelectedDay(1)
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1)
      setCurrentMonth(0)
    } else {
      setCurrentMonth((m) => m + 1)
    }
    setSelectedDay(1)
  }

  const handleGoToday = () => {
    setCurrentYear(TODAY_YEAR)
    setCurrentMonth(TODAY_MONTH)
    setSelectedDay(TODAY_DAY)
  }

  // Manejadores de Drawers
  const closeDrawer = () => {
    setDrawerMode("none")
    setSelectedEvent(null)
  }

  const openCreateForDay = (
    dayToUse = selectedDay,
    defaultKind: AgendaKind = "evento",
  ) => {
    const initialKind = filterVenue ? "evento" : defaultKind
    const initialTipo: TipoAgendamiento =
      initialKind === "cita"
        ? "reunion_cliente"
        : (initialKind as TipoAgendamiento) || "evento"
    setSelectedEvent(null)
    setSelectedDay(dayToUse)
    setFormData({
      kind: initialKind,
      tipo_agendamiento: initialTipo,
      title: "",
      client: "",
      cliente_id: "",
      time: "10:00",
      dateISO: formatToISODate(currentYear, currentMonth, dayToUse),
      type:
        initialTipo === "reunion_cliente"
          ? "Reunión de Cotización"
          : "Reserva de Evento",
      estado: "Pendiente",
      venue: filterVenue || "Salón Principal 360",
      modalidadCita: "Videollamada (Meet / Zoom)",
      notas: "",
      fechaTentativaEvento: "",
      tipoEventoTentativo: "",
      lugarTentativo: "",
    })
    setDrawerMode("create")
  }

  const openEdit = (ev: AgendaEvent) => {
    setSelectedEvent(ev)
    setFormData({
      kind: ev.kind,
      tipo_agendamiento:
        ev.tipo_agendamiento ||
        (ev.kind === "cita" ? "reunion_cliente" : "evento"),
      title: ev.title,
      client: ev.client,
      cliente_id: ev.cliente_id || "",
      time: ev.time,
      dateISO: formatToISODate(ev.year, ev.month, ev.day),
      type: ev.type,
      estado: ev.estado,
      venue: ev.venue || "Salón Principal 360",
      modalidadCita: ev.modalidadCita || "Videollamada (Meet / Zoom)",
      notas: ev.notas || "",
      fechaTentativaEvento: ev.fechaTentativaEvento || "",
      tipoEventoTentativo: ev.tipoEventoTentativo || "",
      lugarTentativo: ev.lugarTentativo || "",
    })
    setDrawerMode("edit")
  }

  const openDetail = (ev: AgendaEvent) => {
    setSelectedEvent(ev)
    setSelectedDay(ev.day)
    setDrawerMode("detail")
  }

  const handleSelectDay = (day: number) => {
    setSelectedDay(day)
    setSidebarScope("day")
  }

  const handleSwitchKind = (newKind: AgendaKind) => {
    if (newKind === formData.kind) return
    setFormData((f) => ({
      ...f,
      kind: newKind,
      type: newKind === "cita" ? "Reunión de Cotización" : "Reserva de Evento",
      estado: newKind === "cita" ? "Programada" : "Pendiente",
      venue: f.venue || filterVenue || "Salón Principal 360",
      modalidadCita: f.modalidadCita || "Videollamada (Meet / Zoom)",
    }))
  }

  const handleChangeEstado = (id: string, nuevoEstado: string) => {
    const newColor = getEstadoColor(nuevoEstado)
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, estado: nuevoEstado, color: newColor } : ev,
      ),
    )
    if (selectedEvent?.id === id) {
      setSelectedEvent((prev) =>
        prev ? { ...prev, estado: nuevoEstado, color: newColor } : prev,
      )
    }
    toast.success(`Estado actualizado a "${nuevoEstado}"`)
  }

  const resetFilters = () => {
    setFilterKind("Todos")
    setFilterEstado("Todos")
    setFilterVenue(null)
  }

  const activeChips = useMemo(() => {
    const list: {
      key: string
      label: string
      icon?: React.ReactNode
      onClear: () => void
    }[] = []
    if (filterKind !== "Todos") {
      list.push({
        key: "kind",
        label: filterKind === "cita" ? "Citas" : "Eventos",
        onClear: () => setFilterKind("Todos"),
      })
    }
    if (filterEstado !== "Todos") {
      list.push({
        key: "estado",
        label: `Estado: ${labelFiltroEstado(filterEstado)}`,
        onClear: () => setFilterEstado("Todos"),
      })
    }
    if (filterVenue) {
      list.push({
        key: "venue",
        label: `Locación: ${filterVenue}`,
        icon: <MapPin size={12} aria-hidden="true" />,
        onClear: () => setFilterVenue(null),
      })
    }
    return list
  }, [filterKind, filterEstado, filterVenue])

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error("Por favor ingresa un título o asunto")
      return
    }

    const parsed = parseDateISO(
      formData.dateISO,
      currentYear,
      currentMonth,
      selectedDay,
    )
    const isReunion =
      formData.tipo_agendamiento === "reunion_cliente" ||
      formData.kind === "cita"
    const isEditing = drawerMode === "edit"

    if (isEditing && selectedEvent) {
      const updated: AgendaEvent = {
        ...selectedEvent,
        kind: formData.kind,
        tipo_agendamiento:
          formData.tipo_agendamiento ||
          (formData.kind === "cita" ? "reunion_cliente" : "evento"),
        title: formData.title.trim(),
        client: formData.client.trim() || "Cliente por confirmar",
        cliente_id: formData.cliente_id || undefined,
        time: formData.time || "10:00",
        type: formData.type,
        estado: formData.estado,
        color: getEstadoColor(formData.estado),
        year: parsed.year,
        month: parsed.month,
        day: parsed.day,
        venue: isReunion ? undefined : formData.venue || "Salón Principal 360",
        modalidadCita: isReunion ? formData.modalidadCita : undefined,
        notas: isReunion ? formData.notas.trim() : undefined,
        fechaTentativaEvento: isReunion
          ? formData.fechaTentativaEvento?.trim() || undefined
          : undefined,
        tipoEventoTentativo: isReunion
          ? formData.tipoEventoTentativo?.trim() || undefined
          : undefined,
        lugarTentativo: isReunion
          ? formData.lugarTentativo?.trim() || undefined
          : undefined,
      }

      setEvents((prev) =>
        prev.map((ev) => (ev.id === selectedEvent.id ? updated : ev)),
      )
      toast.success(`"${updated.title}" actualizado`)
    } else {
      const newEv: AgendaEvent = {
        id: String(Date.now()),
        kind: formData.kind,
        tipo_agendamiento:
          formData.tipo_agendamiento ||
          (formData.kind === "cita" ? "reunion_cliente" : "evento"),
        title: formData.title.trim(),
        type: formData.type,
        color: getEstadoColor(formData.estado || "Pendiente"),
        time: formData.time || "10:00",
        day: parsed.day,
        month: parsed.month,
        year: parsed.year,
        client: formData.client.trim() || "Cliente por confirmar",
        cliente_id: formData.cliente_id || undefined,
        estado: formData.estado || "Pendiente",
        venue: isReunion ? undefined : formData.venue || "Salón Principal 360",
        modalidadCita: isReunion ? formData.modalidadCita : undefined,
        notas: isReunion ? formData.notas.trim() : undefined,
        fechaTentativaEvento: isReunion
          ? formData.fechaTentativaEvento?.trim() || undefined
          : undefined,
        tipoEventoTentativo: isReunion
          ? formData.tipoEventoTentativo?.trim() || undefined
          : undefined,
        lugarTentativo: isReunion
          ? formData.lugarTentativo?.trim() || undefined
          : undefined,
      }

      setEvents((prev) => [...prev, newEv])
      toast.success(
        `"${newEv.title}" agendado para el ${parsed.day} de ${MESES_NOMBRES[parsed.month]}`,
      )
    }

    setCurrentYear(parsed.year)
    setCurrentMonth(parsed.month)
    setSelectedDay(parsed.day)
    closeDrawer()
  }

  const monthName = MESES_NOMBRES[currentMonth]

  const eventsToDisplay = useMemo(
    () => (sidebarScope === "day" ? selectedDayEvents : filteredMonthEvents),
    [sidebarScope, selectedDayEvents, filteredMonthEvents],
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50/60 dark:bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado (igual que las demás páginas) ── */}
        <PageHeader
          title="Agendamiento"
          actionLabel="Crear agendamiento"
          onAction={() => openCreateForDay(selectedDay, "evento")}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar"
          activeFilterCount={activeChips.length}
          activeFilterPills={activeChips}
          onResetFilters={resetFilters}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Tipo de registro
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {KIND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterKind(opt.value)}
                  aria-pressed={filterKind === opt.value}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center truncate ${focusRing} ${
                    filterKind === opt.value
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#CBD5E1] hover:text-[#F8FAFC]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {FILTROS_ESTADO.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilterEstado(opt.value)}
                  aria-pressed={filterEstado === opt.value}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-center truncate ${focusRing} ${
                    filterEstado === opt.value
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#CBD5E1] hover:text-[#F8FAFC]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </PageHeader>

        {/* ── Calendario Principal Unificado con Panel Lateral (Estética según referencia visual) ── */}
        <AgendamientoCalendar
          currentYear={currentYear}
          currentMonth={currentMonth}
          selectedDay={selectedDay}
          days={days}
          startDayOfWeek={startDayOfWeek}
          eventsByDay={eventsByDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onGoToday={handleGoToday}
          onSelectDay={handleSelectDay}
          onOpenEvent={openDetail}
          onQuickCreate={(day) => openCreateForDay(day, "cita")}
          sidebarContent={
            <div className="space-y-4">
              {filteredMonthEvents.length === 0 ? (
                /* ── Estado vacío idéntico a la referencia visual ── */
                <div className="border border-dashed border-slate-200 dark:border-[#262D3D] rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                    No hay eventos en este mes.
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] mt-1.5 max-w-xs leading-relaxed">
                    Crea un evento o cambia de mes para ver la agenda.
                  </p>
                  <button
                    type="button"
                    onClick={() => openCreateForDay(selectedDay || 1, "cita")}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Crear agendamiento
                  </button>
                </div>
              ) : (
                /* ── Panel Exclusivo de Próximos Eventos ── */
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#262D3D]/60">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                        Próximos eventos
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                        {filteredMonthEvents.length}{" "}
                        {filteredMonthEvents.length === 1
                          ? "evento programado"
                          : "eventos programados"}{" "}
                        en {monthName}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openCreateForDay(selectedDay, "cita")}
                      title="Crear agendamiento"
                      aria-label="Crear agendamiento"
                      className="p-1.5 rounded-lg bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C4B5FD] hover:bg-[#7C3AED]/20 dark:hover:bg-[#7C3AED]/25 transition-colors cursor-pointer"
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  {/* Píldoras de filtro: Todos vs Día seleccionado */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#111318] rounded-xl border border-slate-200/80 dark:border-[#262D3D]">
                    <button
                      type="button"
                      onClick={() => setSidebarScope("all")}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                        sidebarScope === "all"
                          ? "bg-white dark:bg-[#181B22] text-[#7C3AED] dark:text-[#C4B5FD] shadow-xs"
                          : "text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      Todos ({filteredMonthEvents.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setSidebarScope("day")}
                      className={`flex-1 py-1 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                        sidebarScope === "day"
                          ? "bg-white dark:bg-[#181B22] text-[#7C3AED] dark:text-[#C4B5FD] shadow-xs"
                          : "text-slate-500 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-white"
                      }`}
                    >
                      Día {selectedDay} ({selectedDayEvents.length})
                    </button>
                  </div>

                  {/* Lista de eventos */}
                  {sidebarScope === "day" && selectedDayEvents.length === 0 ? (
                    <div className="space-y-4 pt-1">
                      <div className="border border-dashed border-slate-200 dark:border-[#262D3D] rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#222734] text-slate-400 dark:text-[#94A3B8] flex items-center justify-center mb-2">
                          <CalendarIcon size={16} />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
                          Sin eventos para el {selectedDay} de {monthName}
                        </p>
                        <button
                          type="button"
                          onClick={() => openCreateForDay(selectedDay, "cita")}
                          className="mt-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <Plus size={12} />
                          Agendar para este día
                        </button>
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#64748B] mb-2 px-1">
                          Otros eventos en {monthName}
                        </p>
                        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                          {filteredMonthEvents.map((ev) => {
                            const meta = getEstadoMeta(ev.estado)
                            return (
                              <div
                                key={ev.id}
                                onClick={() => openDetail(ev)}
                                className="group p-3 rounded-2xl bg-white dark:bg-[#111318] border border-slate-200/80 dark:border-[#262D3D] hover:border-[#7C3AED]/70 dark:hover:border-[#7C3AED] transition-all cursor-pointer shadow-2xs space-y-2"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA]">
                                    <span className="px-2 py-0.5 rounded-md bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C4B5FD] tabular-nums">
                                      {ev.day} {monthName.slice(0, 3)}
                                    </span>
                                    <span className="text-slate-500 dark:text-[#94A3B8] font-normal text-[11px] tabular-nums">
                                      {ev.time} hs
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
                                  >
                                    {ev.estado}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC] group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors truncate">
                                    {ev.title}
                                  </h4>
                                  <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] truncate mt-0.5">
                                    {ev.client}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-[#262D3D]/50 text-[11px] text-slate-400 dark:text-[#64748B]">
                                  <span className="truncate">
                                    {ev.tipo_agendamiento === "visita_tecnica"
                                      ? "Visita técnica"
                                      : ev.tipo_agendamiento === "reunion_cliente" || ev.kind === "cita"
                                        ? "Reunión cliente"
                                        : ev.tipo_agendamiento === "otro"
                                          ? "Otro"
                                          : "Evento"}
                                  </span>
                                  {ev.venue && (
                                    <span className="flex items-center gap-1 truncate shrink-0 max-w-[130px]">
                                      <MapPin size={11} className="shrink-0" />
                                      <span className="truncate">{ev.venue}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                      {eventsToDisplay.map((ev) => {
                        const meta = getEstadoMeta(ev.estado)
                        const isSelectedDayEvent = ev.day === selectedDay
                        return (
                          <div
                            key={ev.id}
                            onClick={() => openDetail(ev)}
                            className={`group p-3 rounded-2xl bg-white dark:bg-[#111318] border transition-all cursor-pointer shadow-2xs space-y-2 ${
                              isSelectedDayEvent
                                ? "border-[#7C3AED] ring-1 ring-[#7C3AED]/25"
                                : "border-slate-200/80 dark:border-[#262D3D] hover:border-slate-300 dark:hover:border-[#3B475E]"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] dark:text-[#A78BFA]">
                                <span className="px-2 py-0.5 rounded-md bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 text-[#7C3AED] dark:text-[#C4B5FD] tabular-nums">
                                  {ev.day} {monthName.slice(0, 3)}
                                </span>
                                <span className="text-slate-500 dark:text-[#94A3B8] font-normal text-[11px] tabular-nums">
                                  {ev.time} hs
                                </span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
                              >
                                {ev.estado}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC] group-hover:text-[#7C3AED] dark:group-hover:text-[#A78BFA] transition-colors truncate">
                                {ev.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-[#94A3B8] truncate mt-0.5">
                                {ev.client}
                              </p>
                            </div>
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-[#262D3D]/50 text-[11px] text-slate-400 dark:text-[#64748B]">
                              <span className="truncate">
                                {ev.tipo_agendamiento === "visita_tecnica"
                                  ? "Visita técnica"
                                  : ev.tipo_agendamiento === "reunion_cliente" || ev.kind === "cita"
                                    ? "Reunión cliente"
                                    : ev.tipo_agendamiento === "otro"
                                      ? "Otro"
                                      : "Evento"}
                              </span>
                              {ev.venue && (
                                <span className="flex items-center gap-1 truncate shrink-0 max-w-[130px]">
                                  <MapPin size={11} className="shrink-0" />
                                  <span className="truncate">{ev.venue}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
      </main>

      {/* Drawer de Detalle */}
      <AgendamientoDetailDrawer
        isOpen={drawerMode === "detail"}
        onClose={closeDrawer}
        selectedEvent={selectedEvent}
        selectedDay={selectedDay}
        currentMonth={currentMonth}
        currentYear={currentYear}
        dayEvents={selectedDayEvents}
        onChangeEstado={handleChangeEstado}
        onConfirmItem={handleConfirmItem}
        onCancelItem={handleCancelItem}
        onOpenEdit={openEdit}
        onOpenCreate={openCreateForDay}
        onSelectEvent={openDetail}
        onBack={() => setSelectedEvent(null)}
      />

      {/* Drawer de Formulario (Crear / Editar) */}
      <AgendamientoFormDrawer
        isOpen={
          drawerMode === "create" ||
          (drawerMode === "edit" && Boolean(selectedEvent))
        }
        onClose={closeDrawer}
        isEditing={drawerMode === "edit"}
        formData={formData}
        setFormData={setFormData}
        clientOptions={clientOptions}
        venueOptions={venueOptions}
        onAddClient={(c) => {
          const clean = c.trim()
          if (clean && !customClients.includes(clean))
            setCustomClients((prev) => [...prev, clean])
          setFormData((f) => ({ ...f, client: clean }))
        }}
        onAddVenue={(v) => {
          const clean = v.trim()
          if (clean && !customVenues.includes(clean))
            setCustomVenues((prev) => [...prev, clean])
          setFormData((f) => ({ ...f, venue: clean }))
        }}
        onSwitchKind={handleSwitchKind}
        onSubmit={handleSubmitForm}
      />
    </div>
  )
}
