import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { useToast } from "../../components/Toast"
import type {
  ClienteItem,
  ClienteDrawerMode,
  ClienteFormData,
  TipoCliente,
} from "./types"
import { INITIAL_CLIENTS, HISTORIAL, ESTADO_FILTER_OPTIONS } from "./data"
import { getClienteDisplayName } from "./utils"
import { ClienteTable } from "./components/ClienteTable"
import { ClienteDetailDrawer } from "./drawers/ClienteDetailDrawer"
import { ClienteFormDrawer } from "./drawers/ClienteFormDrawer"

export default function ClientesPage() {
  const {
    items: clients,
    createItem,
    updateItem,
    removeItem,
  } = useCrudResource<ClienteItem>({
    endpoint: "/clientes",
    storageKey: "high_events_clientes_v1",
    initialData: INITIAL_CLIENTS,
  })
  const [selectedClient, setSelectedClient] = useState<ClienteItem | null>(null)
  const toast = useToast()
  const [drawerMode, setDrawerMode] = useState<ClienteDrawerMode>("create")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterTipo, setFilterTipo] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  const [formState, setFormState] = useState<ClienteFormData>({
    tipo_cliente: "Empresa",
    tipo_documento: "NIT",
    numero_documento: "",
    razon_social: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    contacto_nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "Activo",
  })

  const openCreate = () => {
    setSelectedClient(null)
    setFormState({
      tipo_cliente: "Empresa",
      tipo_documento: "NIT",
      numero_documento: "",
      razon_social: "",
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      contacto_nombre: "",
      correo: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      estado: "Activo",
    })
    setDrawerMode("create")
    setIsDrawerOpen(true)
  }

  const openEdit = (client: ClienteItem) => {
    setSelectedClient(client)
    setFormState({ ...client })
    setDrawerMode("edit")
    setIsDrawerOpen(true)
  }

  const openView = (client: ClienteItem) => {
    setSelectedClient(client)
    setDrawerMode("view")
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedClient(null)
  }

  const filteredData = useMemo(() => {
    return clients.filter((c) => {
      const q = search.trim().toLowerCase()
      const matchSearch =
        !q ||
        c.razon_social?.toLowerCase().includes(q) ||
        c.primer_nombre?.toLowerCase().includes(q) ||
        c.primer_apellido?.toLowerCase().includes(q) ||
        c.contacto_nombre?.toLowerCase().includes(q) ||
        c.numero_documento?.toLowerCase().includes(q) ||
        c.correo?.toLowerCase().includes(q)
      const matchTipo = filterTipo === "Todos" || c.tipo_cliente === filterTipo
      const matchEstado = filterEstado === "Todos" || c.estado === filterEstado
      return matchSearch && matchTipo && matchEstado
    })
  }, [clients, search, filterTipo, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const setClientEstado = (id: string, estado: string) => {
    void updateItem(id, { estado: estado as "Activo" | "Inactivo" })
    setSelectedClient((prev) =>
      prev && prev.id === id
        ? { ...prev, estado: estado as "Activo" | "Inactivo" }
        : prev,
    )
    const target = clients.find((c) => c.id === id)
    if (target) {
      toast.info(`${getClienteDisplayName(target)} ahora está ${estado}`)
    }
  }

  const handleDelete = (c: ClienteItem) => {
    if (confirm(`¿Eliminar cliente ${getClienteDisplayName(c)}?`)) {
      void removeItem(c.id)
      toast.success("Cliente eliminado")
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      formState.tipo_cliente === "Empresa" &&
      !formState.razon_social?.trim()
    ) {
      toast.error("La razón social de la empresa es obligatoria")
      return
    }

    if (
      formState.tipo_cliente === "Natural" &&
      (!formState.primer_nombre?.trim() || !formState.primer_apellido?.trim())
    ) {
      toast.error("El primer nombre y primer apellido son obligatorios")
      return
    }

    if (!formState.numero_documento?.trim()) {
      toast.error("El número de documento es obligatorio")
      return
    }

    if (drawerMode === "create") {
      const newClient: ClienteItem = {
        id: String(Date.now()),
        tipo_cliente: formState.tipo_cliente || "Empresa",
        razon_social: formState.razon_social || "",
        primer_nombre: formState.primer_nombre || "",
        segundo_nombre: formState.segundo_nombre || "",
        primer_apellido: formState.primer_apellido || "",
        segundo_apellido: formState.segundo_apellido || "",
        contacto_nombre: formState.contacto_nombre || "",
        tipo_documento: formState.tipo_documento || "NIT",
        numero_documento: formState.numero_documento || "",
        correo: formState.correo || "",
        telefono: formState.telefono || "",
        direccion: formState.direccion || "",
        ciudad: formState.ciudad || "",
        estado: "Activo",
        fecha_creacion: new Date().toISOString(),
      }
      void createItem(newClient)
      toast.success("Cliente creado exitosamente")
    } else if (drawerMode === "edit" && selectedClient) {
      void updateItem(selectedClient.id, formState)
      toast.success("Cliente actualizado correctamente")
    }

    closeDrawer()
  }

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: clients.length },
      {
        id: "Empresa",
        label: "Empresas",
        count: clients.filter((c) => c.tipo_cliente === "Empresa").length,
      },
      {
        id: "Natural",
        label: "Personas Naturales",
        count: clients.filter((c) => c.tipo_cliente === "Natural").length,
      },
    ],
    [clients],
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Clientes"
          actionLabel="Crear cliente"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterTipo !== "Todos" ? 1 : 0) +
            (filterEstado !== "Todos" ? 1 : 0)
          }
          activeFilterPills={[
            ...(filterTipo !== "Todos"
              ? [
                  {
                    key: "tipo",
                    label: `Tipo: ${filterTipo}`,
                    onClear: () => {
                      setFilterTipo("Todos")
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
            setFilterTipo("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Tipo de Cliente
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#111318] p-1 rounded-xl border border-[#262D3D]">
              {(["Todos", "Empresa", "Natural"] as const).map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => {
                    setFilterTipo(tipo)
                    setCurrentPage(1)
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
                    filterTipo === tipo
                      ? "bg-[#7C3AED] text-white font-semibold"
                      : "text-[#94A3B8] hover:text-[#F1F5F9]"
                  }`}
                >
                  {tipo}
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
              options={ESTADO_FILTER_OPTIONS}
            />
          </div>
        </PageHeader>

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={filterTipo}
          onTabChange={(newTab) => {
            setFilterTipo(newTab)
            setCurrentPage(1)
          }}
        />

        {/* ── Tabla Modularizada y Paginación ── */}
        <ClienteTable
          clients={paginatedData}
          totalCount={filteredData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onEmptyAction={openCreate}
          onResetFilters={() => {
            setSearch("")
            setFilterTipo("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
          isFiltered={Boolean(
            search || filterTipo !== "Todos" || filterEstado !== "Todos",
          )}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onStatusChange={setClientEstado}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* View Detail Drawer */}
      <ClienteDetailDrawer
        isOpen={isDrawerOpen && drawerMode === "view"}
        client={selectedClient}
        historial={selectedClient ? HISTORIAL[selectedClient.id] || [] : []}
        onClose={closeDrawer}
        onSetEstado={setClientEstado}
        onOpenEdit={openEdit}
      />

      {/* Create / Edit Drawer */}
      <ClienteFormDrawer
        isOpen={
          isDrawerOpen && (drawerMode === "create" || drawerMode === "edit")
        }
        mode={drawerMode === "edit" ? "edit" : "create"}
        selectedClient={selectedClient}
        formState={formState}
        setFormState={setFormState}
        onClose={closeDrawer}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
