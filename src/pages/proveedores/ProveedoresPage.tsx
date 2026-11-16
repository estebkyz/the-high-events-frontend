import { usePagination } from "../../hooks/usePagination"
import React, { useState, useMemo } from "react"
import { PageHeader } from "../../components/PageHeader"
import { CustomSelect } from "../../components/CustomSelect"
import { useToast } from "../../components/Toast"
import type {
  ProveedorItem,
  ProveedorDrawerMode,
  ProveedorViewTab,
  ProveedorFormData,
} from "./types"
import {
  INITIAL_PROVIDERS,
  ALL_SERVICIOS,
  ALL_EQUIPOS_PROVEEDOR,
  ESTADO_FILTER_OPTIONS,
} from "./data"
import { getProveedorContacto } from "./utils"
import { ProveedorTable } from "./components/ProveedorTable"
import { ProveedorDetailDrawer } from "./drawers/ProveedorDetailDrawer"
import { ProveedorFormDrawer } from "./drawers/ProveedorFormDrawer"

export default function ProveedoresPage() {
  const [providers, setProviders] = useState<ProveedorItem[]>(INITIAL_PROVIDERS)
  const toast = useToast()

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterServicio, setFilterServicio] = useState<string[]>([])
  const [filterEquipo, setFilterEquipo] = useState<string[]>([])
  const [filterEstado, setFilterEstado] = useState("Todos")

  // Drawers
  const [drawerMode, setDrawerMode] = useState<ProveedorDrawerMode>("none")
  const [selectedProvider, setSelectedProvider] =
    useState<ProveedorItem | null>(null)
  const [viewTab, setViewTab] = useState<ProveedorViewTab>("info")

  const [formState, setFormState] = useState<ProveedorFormData>({
    nit_documento: "",
    razon_social: "",
    contacto_primer_nombre: "",
    contacto_segundo_nombre: "",
    contacto_primer_apellido: "",
    contacto_segundo_apellido: "",
    telefono: "",
    correo: "",
    servicios: [],
    equipos: [],
    estado: "Activo",
  })

  const filteredData = useMemo(
    () =>
      providers.filter((p) => {
        if (filterEstado !== "Todos" && p.estado !== filterEstado) return false
        if (
          filterServicio.length > 0 &&
          !filterServicio.some((s) => p.servicios.includes(s))
        )
          return false
        if (
          filterEquipo.length > 0 &&
          !filterEquipo.some((eq) => p.equipos.includes(eq))
        )
          return false
        if (search) {
          const q = search.toLowerCase()
          const contactName = getProveedorContacto(p).toLowerCase()
          const matchesCatalog =
            p.servicios.some((s) => s.toLowerCase().includes(q)) ||
            p.equipos.some((eq) => eq.toLowerCase().includes(q))
          if (
            !p.razon_social.toLowerCase().includes(q) &&
            !p.nit_documento.toLowerCase().includes(q) &&
            !contactName.includes(q) &&
            !p.correo.toLowerCase().includes(q) &&
            !matchesCatalog
          ) {
            return false
          }
        }
        return true
      }),
    [providers, search, filterServicio, filterEquipo, filterEstado],
  )

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredData)

  const closeDrawer = () => {
    setDrawerMode("none")
    setSelectedProvider(null)
    setViewTab("info")
  }

  const openView = (row: ProveedorItem) => {
    setSelectedProvider(row)
    setViewTab("info")
    setDrawerMode("view")
  }

  const openEdit = (row: ProveedorItem) => {
    setSelectedProvider(row)
    setFormState({
      ...row,
      servicios: [...row.servicios],
      equipos: [...(row.equipos || [])],
    })
    setDrawerMode("edit")
  }

  const openCreate = () => {
    setSelectedProvider(null)
    setFormState({
      nit_documento: "",
      razon_social: "",
      contacto_primer_nombre: "",
      contacto_segundo_nombre: "",
      contacto_primer_apellido: "",
      contacto_segundo_apellido: "",
      telefono: "",
      correo: "",
      servicios: [],
      equipos: [],
      estado: "Activo",
    })
    setDrawerMode("create")
  }

  const toggleEstado = (id: string, explicitNewEst?: "Activo" | "Inactivo") => {
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newEst =
            explicitNewEst ?? (p.estado === "Activo" ? "Inactivo" : "Activo")
          toast.info(`${p.razon_social} ahora está ${newEst}`)
          return { ...p, estado: newEst }
        }
        return p
      }),
    )
    if (selectedProvider?.id === id) {
      setSelectedProvider((prev) =>
        prev
          ? {
              ...prev,
              estado:
                explicitNewEst ??
                (prev.estado === "Activo" ? "Inactivo" : "Activo"),
            }
          : prev,
      )
    }
  }

  const handleDelete = (p: ProveedorItem) => {
    if (confirm(`¿Eliminar proveedor ${p.razon_social}?`)) {
      setProviders((prev) => prev.filter((item) => item.id !== p.id))
      toast.success("Proveedor eliminado")
    }
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formState.nit_documento?.trim()) {
      toast.error("El NIT o documento legal es obligatorio")
      return
    }

    if (!formState.razon_social?.trim()) {
      toast.error("La razón social o nombre de la empresa es obligatorio")
      return
    }

    if (
      !formState.contacto_primer_nombre?.trim() ||
      !formState.contacto_primer_apellido?.trim()
    ) {
      toast.error(
        "El primer nombre y primer apellido del contacto son obligatorios",
      )
      return
    }

    if (!formState.correo?.trim()) {
      toast.error("El correo electrónico es obligatorio")
      return
    }

    if (
      (!formState.servicios || formState.servicios.length === 0) &&
      (!formState.equipos || formState.equipos.length === 0)
    ) {
      toast.error(
        "Selecciona al menos un servicio especializado o equipo técnico que suministre el proveedor",
      )
      return
    }

    if (drawerMode === "create") {
      const newProvider: ProveedorItem = {
        id: String(Date.now()),
        nit_documento: formState.nit_documento || "",
        razon_social: formState.razon_social || "",
        contacto_primer_nombre: formState.contacto_primer_nombre || "",
        contacto_segundo_nombre: formState.contacto_segundo_nombre || "",
        contacto_primer_apellido: formState.contacto_primer_apellido || "",
        contacto_segundo_apellido: formState.contacto_segundo_apellido || "",
        telefono: formState.telefono || "",
        correo: formState.correo || "",
        servicios: formState.servicios || [],
        equipos: formState.equipos || [],
        estado: formState.estado || "Activo",
        contratosCount: 0,
        historial: [],
        fecha_creacion: new Date().toISOString(),
      }
      setProviders([newProvider, ...providers])
      toast.success("Proveedor registrado exitosamente")
    } else if (drawerMode === "edit" && selectedProvider) {
      setProviders(
        providers.map((p) =>
          p.id === selectedProvider.id
            ? ({ ...p, ...formState } as ProveedorItem)
            : p,
        ),
      )
      toast.success("Proveedor actualizado correctamente")
    }

    closeDrawer()
  }

  const toggleServicioFilter = (servicio: string) => {
    setFilterServicio((prev) =>
      prev.includes(servicio)
        ? prev.filter((s) => s !== servicio)
        : [...prev, servicio],
    )
    setCurrentPage(1)
  }

  const toggleEquipoFilter = (equipo: string) => {
    setFilterEquipo((prev) =>
      prev.includes(equipo)
        ? prev.filter((eq) => eq !== equipo)
        : [...prev, equipo],
    )
    setCurrentPage(1)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Proveedores"
          actionLabel="Crear proveedor"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterEstado !== "Todos" ? 1 : 0) +
            (filterServicio.length > 0 ? 1 : 0) +
            (filterEquipo.length > 0 ? 1 : 0)
          }
          onResetFilters={() => {
            setFilterEstado("Todos")
            setFilterServicio([])
            setFilterEquipo([])
            setCurrentPage(1)
          }}
        >
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#A78BFA]">
                Servicios y Personal Especializado
              </label>
              {filterServicio.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterServicio([])
                    setCurrentPage(1)
                  }}
                  className="text-[10px] text-[#EF4444] hover:underline cursor-pointer"
                >
                  Limpiar ({filterServicio.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-[#111318] rounded-xl border border-[#2D3748]">
              {ALL_SERVICIOS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleServicioFilter(s)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                    filterServicio.includes(s)
                      ? "bg-[#7C3AED]/20 text-[#A78BFA] border-[#7C3AED]/50 font-semibold"
                      : "bg-[#1A1D23] text-[#64748B] border-[#2D3748] hover:text-[#94A3B8]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#60A5FA]">
                Equipos e Insumos Técnicos
              </label>
              {filterEquipo.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterEquipo([])
                    setCurrentPage(1)
                  }}
                  className="text-[10px] text-[#EF4444] hover:underline cursor-pointer"
                >
                  Limpiar ({filterEquipo.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-[#111318] rounded-xl border border-[#2D3748]">
              {ALL_EQUIPOS_PROVEEDOR.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleEquipoFilter(eq)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                    filterEquipo.includes(eq)
                      ? "bg-[#3B82F6]/20 text-[#60A5FA] border-[#3B82F6]/50 font-semibold"
                      : "bg-[#1A1D23] text-[#64748B] border-[#2D3748] hover:text-[#94A3B8]"
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        </PageHeader>

        {/* ── Tabla Modularizada y Paginación ── */}
        <ProveedorTable
          providers={paginatedData}
          totalCount={filteredData.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onToggleStatus={toggleEstado}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* View Detail Drawer */}
      <ProveedorDetailDrawer
        isOpen={drawerMode === "view"}
        provider={selectedProvider}
        viewTab={viewTab}
        onViewTabChange={setViewTab}
        onClose={closeDrawer}
        onToggleEstado={(id) => toggleEstado(id)}
        onOpenEdit={openEdit}
      />

      {/* Create / Edit Drawer */}
      <ProveedorFormDrawer
        isOpen={drawerMode === "create" || drawerMode === "edit"}
        mode={drawerMode === "edit" ? "edit" : "create"}
        selectedProvider={selectedProvider}
        formState={formState}
        setFormState={setFormState}
        onClose={closeDrawer}
        onSubmit={handleSaveForm}
      />
    </div>
  )
}

