import { usePagination } from "../../hooks/usePagination"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutGrid, List, CalendarDays } from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { useToast } from "../../components/Toast"
import { EmptyState } from "../../components/EmptyState"
import { EVENTO_PATHS } from "../../routes/paths"
import { EVENTOS_MOCK } from "./data"
import type { EstadoEvento, EventoItem } from "./types"
import { EventoCard } from "./components/EventoCard"
import { EventoDetailDrawer } from "./drawers/EventoDetailDrawer"
import { EventoTable } from "./components/EventoTable"

type ModalidadTab = "Todos" | "Propios" | "Clientes"
type ViewMode = "grid" | "table"

/** Listado de eventos (`/eventos`) con vista en tarjetas o tabla. */
export default function EventosPage() {
  const navigate = useNavigate()
  const toast = useToast()

  // Datos de ejemplo: los cambios viven solo en memoria mientras la página está abierta.
  const [events, setEvents] = useState<EventoItem[]>(EVENTOS_MOCK)
  const [activeTab, setActiveTab] = useState<ModalidadTab>("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedEvent, setSelectedEvent] = useState<EventoItem | null>(null)

  // Pagination for table view

  const modalidadCounts = useMemo(() => {
    return {
      Todos: events.length,
      Propios: events.filter((e) => e.modalidad === "Propio").length,
      Clientes: events.filter((e) => e.modalidad === "Cliente").length,
    }
  }, [events])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: modalidadCounts.Todos },
      {
        id: "Propios",
        label: "Propios",
        count: modalidadCounts.Propios,
      },
      { id: "Clientes", label: "Clientes", count: modalidadCounts.Clientes },
    ],
    [modalidadCounts],
  )

  const filteredData = useMemo(() => {
    const q = search.toLowerCase()
    return events.filter((ev) => {
      if (activeTab === "Propios" && ev.modalidad !== "Propio") return false
      if (activeTab === "Clientes" && ev.modalidad !== "Cliente") return false
      if (filterEstado !== "Todos" && ev.estado !== filterEstado) return false
      if (!q) return true
      return (
        ev.nombre.toLowerCase().includes(q) ||
        ev.cliente_nombre.toLowerCase().includes(q) ||
        ev.direccion.toLowerCase().includes(q) ||
        ev.cotizacion_codigo.toLowerCase().includes(q)
      )
    })
  }, [events, activeTab, filterEstado, search])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const openCreate = () => navigate(EVENTO_PATHS.create)
  const openEdit = (ev: EventoItem) => navigate(EVENTO_PATHS.edit(ev.id))

  const handleChangeEstado = (id: string, nuevoEstado: string) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, estado: nuevoEstado as EstadoEvento } : ev,
      ),
    )
    toast.info(`Estado del evento actualizado a ${nuevoEstado}`)
  }

  const handleDeleteEvent = (ev: EventoItem) => {
    if (confirm(`¿Eliminar evento "${ev.nombre}"?`)) {
      setEvents((prev) => prev.filter((e) => e.id !== ev.id))
      toast.success("Evento eliminado correctamente")
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Eventos"
          actionLabel="Crear evento"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (activeTab !== "Todos" ? 1 : 0) + (filterEstado !== "Todos" ? 1 : 0)
          }
          activeFilterPills={[
            ...(activeTab !== "Todos"
              ? [
                  {
                    key: "modalidad",
                    label: `Modalidad: ${activeTab}`,
                    onClear: () => {
                      setActiveTab("Todos")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
            ...(filterEstado !== "Todos"
              ? [
                  {
                    key: "estado",
                    label: `Estado: ${filterEstado}`,
                    onClear: () => {
                      setFilterEstado("Todos")
                      setCurrentPage(1)
                    },
                  },
                ]
              : []),
          ]}
          onResetFilters={() => {
            setActiveTab("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
          extraControls={
            <div className="flex items-center bg-[#181B22] border border-[#262D3D] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#7C3AED] text-white shadow-xs font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
                title="Vista en Tarjetas"
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Tarjetas</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#7C3AED] text-white shadow-xs font-semibold"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
                title="Vista en Tabla"
              >
                <List size={13} />
                <span className="hidden sm:inline">Tabla</span>
              </button>
            </div>
          }
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Modalidad
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {(["Todos", "Propios", "Clientes"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                    activeTab === tab
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado
            </label>
            <CustomSelect
              value={filterEstado}
              onChange={(val) => {
                setFilterEstado(val)
                setCurrentPage(1)
              }}
              options={[
                { label: "Todos los Estados", value: "Todos" },
                { label: "Planificación", value: "Planificación" },
                { label: "Confirmado", value: "Confirmado" },
                { label: "Montaje", value: "Montaje" },
                { label: "En ejecución", value: "En ejecución" },
                { label: "Desmontaje", value: "Desmontaje" },
                { label: "Finalizado", value: "Finalizado" },
                { label: "Cerrado financiero", value: "Cerrado financiero" },
                { label: "Cancelado", value: "Cancelado" },
              ]}
            />
          </div>
        </PageHeader>

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={activeTab}
          onTabChange={(newTab) => {
            setActiveTab(newTab as ModalidadTab)
            setCurrentPage(1)
          }}
        />

        {viewMode === "grid" ? (
          filteredData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((event) => (
                <EventoCard
                  key={event.id}
                  ev={event}
                  onView={() => setSelectedEvent(event)}
                  onEdit={() => openEdit(event)}
                  onDelete={() => handleDeleteEvent(event)}
                  onChangeEstado={(id, nuevo) => handleChangeEstado(id, nuevo)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl p-6">
              <EmptyState
                icon={CalendarDays}
                title={
                  Boolean(search) ||
                  activeTab !== "Todos" ||
                  filterEstado !== "Todos"
                    ? "No se encontraron eventos coincidentes"
                    : "Aún no tienes eventos programados"
                }
                description={
                  Boolean(search) ||
                  activeTab !== "Todos" ||
                  filterEstado !== "Todos"
                    ? "Intenta ajustar los criterios de búsqueda, la modalidad o los filtros de estado."
                    : "Comienza creando eventos propios o de clientes externos para coordinar servicios y staff."
                }
                action={
                  Boolean(search) ||
                  activeTab !== "Todos" ||
                  filterEstado !== "Todos"
                    ? {
                        label: "Limpiar filtros",
                        onClick: () => {
                          setSearch("")
                          setActiveTab("Todos")
                          setFilterEstado("Todos")
                        },
                      }
                    : {
                        label: "+ Crear evento",
                        onClick: () => navigate(EVENTO_PATHS.create),
                      }
                }
              />
            </div>
          )
        ) : (
          <EventoTable
            events={paginatedData}
            totalCount={filteredData.length}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setCurrentPage(1)
            }}
            onPageChange={setCurrentPage}
            onStatusChange={handleChangeEstado}
            onView={setSelectedEvent}
            onEdit={openEdit}
            onDelete={handleDeleteEvent}
            onEmptyAction={() => navigate(EVENTO_PATHS.create)}
            isFiltered={
              Boolean(search) ||
              activeTab !== "Todos" ||
              filterEstado !== "Todos"
            }
            onResetFilters={() => {
              setSearch("")
              setActiveTab("Todos")
              setFilterEstado("Todos")
            }}
          />
        )}
      </main>

      <EventoDetailDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={(ev) => {
          setSelectedEvent(null)
          openEdit(ev)
        }}
      />
    </div>
  )
}
