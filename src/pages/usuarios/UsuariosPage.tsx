import React, { useState, useMemo } from "react"
import { usePagination } from "../../hooks/usePagination"
import { useCrudResource } from "../../hooks/useCrudResource"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { useToast } from "../../components/Toast"
import type { UsuarioItem, UsuarioDrawerMode, UsuarioFormData } from "./types"
import type { Rol } from "../roles/types"
import {
  INITIAL_USERS,
  ESTADO_FILTER_OPTIONS,
} from "./data"
import { getUsuarioFullName } from "./utils"
import { UsuarioTable } from "./components/UsuarioTable"
import { UsuarioFormDrawer } from "./drawers/UsuarioFormDrawer"
import { UsuarioDetailDrawer } from "./drawers/UsuarioDetailDrawer"

export default function UsuariosPage() {
  const { items: users, setItems: setUsers } = useCrudResource<UsuarioItem>({
    endpoint: "/usuarios",
    storageKey: "high_events_usuarios_v1",
    initialData: INITIAL_USERS,
  })
  const { items: rawRoles } = useCrudResource<Rol>({ endpoint: "/roles" })
  const rolFilterOptions = useMemo(
    () => [
      { label: "Todos los Roles", value: "Todos" },
      ...rawRoles.map((r) => ({ label: r.nombre, value: r.nombre })),
    ],
    [rawRoles],
  )
  const toast = useToast()

  // Search & Pagination
  const [search, setSearch] = useState("")

  // Filters
  const [filterRol, setFilterRol] = useState("Todos")
  const [filterEstado, setFilterEstado] = useState("Todos")

  // Drawers
  const [drawerMode, setDrawerMode] = useState<UsuarioDrawerMode>("none")
  const [selectedUser, setSelectedUser] = useState<UsuarioItem | null>(null)
  const [formState, setFormState] = useState<UsuarioFormData>({
    tipo_documento: "CC",
    numero_documento: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    telefono: "",
    rol: "Operador",
    contrasena: "",
    estado: "Activo",
  })

  // Filtered data
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase()
      const fullName = getUsuarioFullName(u).toLowerCase()
      const matchSearch =
        !search ||
        fullName.includes(q) ||
        u.correo.toLowerCase().includes(q) ||
        u.numero_documento.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q)
      const matchRol = filterRol === "Todos" || u.rol === filterRol
      const matchEstado = filterEstado === "Todos" || u.estado === filterEstado
      return matchSearch && matchRol && matchEstado
    })
  }, [users, search, filterRol, filterEstado])

  // Pagination calculations
  const {
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedUsers,
  } = usePagination(filteredUsers)

  // Open Handlers
  const openCreate = () => {
    setSelectedUser(null)
    setFormState({
      tipo_documento: "CC",
      numero_documento: "",
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      correo: "",
      telefono: "",
      rol: rawRoles[0]?.nombre || "",
      contrasena: "",
      estado: "Activo",
    })
    setDrawerMode("create")
  }

  const openEdit = (user: UsuarioItem) => {
    setSelectedUser(user)
    setFormState({ ...user, contrasena: "" })
    setDrawerMode("edit")
  }

  const openView = (user: UsuarioItem) => {
    setSelectedUser(user)
    setDrawerMode("view")
  }

  const closeDrawer = () => {
    setDrawerMode("none")
    setSelectedUser(null)
  }

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newEstado = u.estado === "Activo" ? "Inactivo" : "Activo"
          toast.info(`${getUsuarioFullName(u)} ahora está ${newEstado}`)
          return { ...u, estado: newEstado }
        }
        return u
      }),
    )
    setSelectedUser((prev) =>
      prev && prev.id === id
        ? { ...prev, estado: prev.estado === "Activo" ? "Inactivo" : "Activo" }
        : prev,
    )
  }

  const handleDelete = (u: UsuarioItem) => {
    if (confirm(`¿Eliminar usuario ${getUsuarioFullName(u)}?`)) {
      setUsers((prev) => prev.filter((item) => item.id !== u.id))
      toast.success("Usuario eliminado")
    }
  }

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formState.primer_nombre?.trim() ||
      !formState.primer_apellido?.trim()
    ) {
      toast.error("El primer nombre y primer apellido son obligatorios")
      return
    }

    if (!formState.numero_documento?.trim()) {
      toast.error("El número de documento es obligatorio")
      return
    }

    if (!formState.correo?.trim()) {
      toast.error("El correo electrónico es obligatorio")
      return
    }

    if (
      drawerMode === "create" &&
      (!formState.contrasena || formState.contrasena.length < 6)
    ) {
      toast.error("La contraseña inicial debe tener al menos 6 caracteres")
      return
    }

    if (drawerMode === "create") {
      const newUser: UsuarioItem = {
        id: String(Date.now()),
        tipo_documento: formState.tipo_documento || "CC",
        numero_documento: formState.numero_documento || "",
        primer_nombre: formState.primer_nombre || "",
        segundo_nombre: formState.segundo_nombre || "",
        primer_apellido: formState.primer_apellido || "",
        segundo_apellido: formState.segundo_apellido || "",
        correo: formState.correo || "",
        telefono: formState.telefono || "",
        rol: formState.rol || rawRoles[0]?.nombre || "",
        ultimoAcceso: "Nunca",
        estado: "Activo",
        fecha_creacion: new Date().toISOString(),
        sesiones: [],
      }
      setUsers([newUser, ...users])
      toast.success("Usuario creado exitosamente")
    } else if (drawerMode === "edit" && selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                ...formState,
                contrasena: formState.contrasena || u.contrasena,
              } as UsuarioItem
            : u,
        ),
      )
      toast.success("Usuario actualizado exitosamente")
    }

    closeDrawer()
  }

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: users.length },
      {
        id: "Activo",
        label: "Activos",
        count: users.filter((u) => u.estado === "Activo").length,
      },
      {
        id: "Inactivo",
        label: "Inactivos",
        count: users.filter((u) => u.estado === "Inactivo").length,
      },
    ],
    [users],
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* ── Top Bar con PageHeader estandarizado ── */}
        <PageHeader
          title="Usuarios"
          actionLabel="Crear usuario"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val)
            setCurrentPage(1)
          }}
          searchPlaceholder="Buscar"
          activeFilterCount={
            (filterRol !== "Todos" ? 1 : 0) + (filterEstado !== "Todos" ? 1 : 0)
          }
          activeFilterPills={[
            ...(filterRol !== "Todos"
              ? [
                  {
                    key: "rol",
                    label: `Rol: ${filterRol}`,
                    onClear: () => {
                      setFilterRol("Todos")
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
            setFilterRol("Todos")
            setFilterEstado("Todos")
            setCurrentPage(1)
          }}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Rol de Usuario
            </label>
            <CustomSelect
              value={filterRol}
              onChange={(val) => {
                setFilterRol(val)
                setCurrentPage(1)
              }}
              options={rolFilterOptions}
            />
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
          activeTab={filterEstado}
          onTabChange={(newTab) => {
            setFilterEstado(newTab)
            setCurrentPage(1)
          }}
        />

        {/* ── Tabla Modularizada y Paginación ── */}
        <UsuarioTable
          users={paginatedUsers}
          totalCount={filteredUsers.length}
          pageSize={pageSize}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageSizeChange={(size) => {
            setPageSize(size)
            setCurrentPage(1)
          }}
          onPageChange={setCurrentPage}
          onToggleStatus={toggleStatus}
          onView={openView}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* ── Drawer Crear / Editar ── */}
      <UsuarioFormDrawer
        isOpen={drawerMode === "create" || drawerMode === "edit"}
        mode={drawerMode === "edit" ? "edit" : "create"}
        formState={formState}
        setFormState={setFormState}
        onClose={closeDrawer}
        onSubmit={handleSubmitForm}
      />

      {/* ── Drawer Ver Detalle ── */}
      <UsuarioDetailDrawer
        isOpen={drawerMode === "view"}
        user={selectedUser}
        onClose={closeDrawer}
        onOpenEdit={openEdit}
      />
    </div>
  )
}
