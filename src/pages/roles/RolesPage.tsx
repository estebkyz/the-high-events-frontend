import React, { useState, useMemo } from "react"
import { useCrudResource } from "../../hooks/useCrudResource"
import { Eye, Edit2, Trash2 } from "lucide-react"
import { PageHeader } from "../../components/PageHeader"
import { IndexTabs } from "../../components/IndexTabs"
import { CustomSelect } from "../../components/CustomSelect"
import { TableStatusSelect } from "../../components/TableStatusSelect"
import { useToast } from "../../components/Toast"
import { INITIAL_ROLES, PERMISSION_GROUPS, buildInitialPerms } from "./data"
import { RoleFormDrawer } from "./drawers/RoleFormDrawer"
import type { Rol, PermsMap } from "./types"

export default function RolesPage() {
  const toast = useToast()
  const { items: roles, setItems: setRoles } = useCrudResource<Rol>({
    endpoint: "/roles",
    storageKey: "high_events_roles_v1",
    initialData: INITIAL_ROLES,
  })
  const [perms, setPerms] = useState<PermsMap>(buildInitialPerms)
  const [search, setSearch] = useState("")
  const [filterEstado, setFilterEstado] = useState("Todos")

  // Drawer state: "closed" | "view" | "edit" | "create"
  const [drawerMode, setDrawerMode] = useState<
    "closed" | "view" | "edit" | "create"
  >("closed")
  const [editingRole, setEditingRole] = useState<Rol | null>(null)
  const [formNombre, setFormNombre] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formEstado, setFormEstado] = useState<"Activo" | "Inactivo">("Activo")
  const [draftPerms, setDraftPerms] = useState<Set<string>>(new Set())

  const filteredRoles = useMemo(() => {
    const q = search.trim().toLowerCase()
    return roles.filter((r) => {
      if (filterEstado !== "Todos" && r.estado !== filterEstado) return false
      if (!q) return true
      return (
        r.nombre.toLowerCase().includes(q) ||
        r.descripcion.toLowerCase().includes(q)
      )
    })
  }, [roles, search, filterEstado])

  const quickTabs = useMemo(
    () => [
      { id: "Todos", label: "Todos", count: roles.length },
      {
        id: "Activo",
        label: "Activos",
        count: roles.filter((r) => r.estado === "Activo").length,
      },
      {
        id: "Inactivo",
        label: "Inactivos",
        count: roles.filter((r) => r.estado === "Inactivo").length,
      },
    ],
    [roles],
  )

  const togglePermInMatrix = (roleId: string, privId: string) => {
    setPerms((prev) => {
      const s = new Set(prev[roleId] ?? [])
      if (s.has(privId)) {
        s.delete(privId)
      } else {
        s.add(privId)
      }
      return { ...prev, [roleId]: s }
    })
  }

  const toggleDraftPrivilege = (privId: string) => {
    setDraftPerms((prev) => {
      const next = new Set(prev)
      if (next.has(privId)) next.delete(privId)
      else next.add(privId)
      return next
    })
  }

  const toggleDraftGroupAll = (groupId: string) => {
    const group = PERMISSION_GROUPS.find((g) => g.id === groupId)
    if (!group) return
    setDraftPerms((prev) => {
      const next = new Set(prev)
      const allSelected = group.privileges.every((p) => next.has(p.id))
      group.privileges.forEach((p) => {
        if (allSelected) next.delete(p.id)
        else next.add(p.id)
      })
      return next
    })
  }

  const openCreate = () => {
    setEditingRole(null)
    setFormNombre("")
    setFormDesc("")
    setFormEstado("Activo")
    setDraftPerms(new Set())
    setDrawerMode("create")
  }

  const openView = (role: Rol) => {
    setEditingRole(role)
    setFormNombre(role.nombre)
    setFormDesc(role.descripcion)
    setFormEstado(role.estado)
    setDraftPerms(new Set(perms[role.id] ?? []))
    setDrawerMode("view")
  }

  const openEdit = (role: Rol) => {
    setEditingRole(role)
    setFormNombre(role.nombre)
    setFormDesc(role.descripcion)
    setFormEstado(role.estado)
    setDraftPerms(new Set(perms[role.id] ?? []))
    setDrawerMode("edit")
  }

  const handleStatusChange = (
    roleId: string,
    newEstado: "Activo" | "Inactivo",
  ) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, estado: newEstado } : r)),
    )
    toast.info(`Estado del rol actualizado a ${newEstado}`)
  }

  const deleteRole = (roleId: string) => {
    const target = roles.find((r) => r.id === roleId)
    if (target && target.usuariosCount > 0) {
      toast.error(
        `No se puede eliminar "${target.nombre}" porque tiene ${target.usuariosCount} usuario(s) vinculado(s)`,
      )
      return
    }
    setRoles((p) => p.filter((r) => r.id !== roleId))
    setPerms((p) => {
      const n = { ...p }
      delete n[roleId]
      return n
    })
    toast.success("Rol eliminado correctamente")
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNombre.trim()) return
    if (drawerMode === "edit" && editingRole) {
      setRoles((p) =>
        p.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                nombre: formNombre.trim(),
                descripcion: formDesc.trim(),
                estado: formEstado,
              }
            : r,
        ),
      )
      setPerms((p) => ({
        ...p,
        [editingRole.id]: new Set(draftPerms),
      }))
      toast.success("Rol y privilegios actualizados correctamente")
    } else {
      const id = String(Date.now())
      setRoles((p) => [
        ...p,
        {
          id,
          nombre: formNombre.trim(),
          descripcion: formDesc.trim(),
          usuariosCount: 0,
          estado: "Activo",
        },
      ])
      setPerms((p) => ({ ...p, [id]: new Set(draftPerms) }))
      toast.success("Rol creado exitosamente")
    }
    setDrawerMode("closed")
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Top Bar con PageHeader estandarizado */}
        <PageHeader
          title="Roles"
          actionLabel="Crear rol"
          onAction={openCreate}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar"
          activeFilterCount={filterEstado !== "Todos" ? 1 : 0}
          activeFilterPills={
            filterEstado !== "Todos"
              ? [
                  {
                    key: "estado",
                    label: `Estado: ${filterEstado}`,
                    onClear: () => setFilterEstado("Todos"),
                  },
                ]
              : []
          }
          onResetFilters={() => setFilterEstado("Todos")}
        >
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5 block">
              Estado del Rol
            </label>
            <CustomSelect
              value={filterEstado}
              onChange={(val) => setFilterEstado(val)}
              options={[
                { label: "Todos los Estados", value: "Todos" },
                { label: "Activos", value: "Activo" },
                { label: "Inactivos", value: "Inactivo" },
              ]}
            />
          </div>
        </PageHeader>

        {/* ── Shopify Polaris IndexTabs: Vistas Rápidas ── */}
        <IndexTabs
          tabs={quickTabs}
          activeTab={filterEstado}
          onTabChange={setFilterEstado}
        />

        {/* Tabla Limpia de Listado de Roles (Tabla roles en BD) */}
        <div className="bg-[#181B22] border border-[#262D3D] rounded-2xl overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-[#262D3D] text-xs font-medium text-[#94A3B8] bg-[#111318]">
                  <th scope="col" className="py-3.5 px-4">
                    Nombre
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Descripción
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Permisos / Privilegios
                  </th>
                  <th scope="col" className="py-3.5 px-4">
                    Estado
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262D3D]/50">
                {filteredRoles.map((role) => {
                  const roleSet = perms[role.id] ?? new Set()
                  const activeModulesCount = PERMISSION_GROUPS.filter((g) =>
                    g.privileges.some((p) => roleSet.has(p.id)),
                  ).length

                  return (
                    <tr
                      key={role.id}
                      className="hover:bg-[#222734]/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-[#F8FAFC]">
                            {role.nombre}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[#94A3B8] max-w-md">
                        {role.descripcion || "Sin descripción"}
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => openView(role)}
                          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#7C3AED]/15 text-[#C4B5FD] transition-colors cursor-pointer"
                        >
                          <span>
                            {activeModulesCount} de {PERMISSION_GROUPS.length}{" "}
                            módulos
                          </span>
                          <span className="text-[10.5px] text-[#A78BFA] font-mono">
                            ({roleSet.size} priv.)
                          </span>
                        </button>
                      </td>


                      <td className="py-3.5 px-4">
                        <TableStatusSelect
                          currentStatus={role.estado}
                          options={["Activo", "Inactivo"]}
                          onStatusChange={(newEst) =>
                            handleStatusChange(
                              role.id,
                              newEst as "Activo" | "Inactivo",
                            )
                          }
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openView(role)}
                            title="Ver permisos y privilegios del rol"
                            aria-label={`Ver detalle de ${role.nombre}`}
                            className="p-2 text-[#94A3B8] hover:text-[#A78BFA] hover:bg-[#7C3AED]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(role)}
                            title="Editar rol, permisos y privilegios"
                            aria-label={`Editar ${role.nombre}`}
                            className="p-2 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <span
                            aria-hidden="true"
                            className="w-px h-5 bg-[#262D3D] mx-1"
                          />
                          <button
                            type="button"
                            onClick={() => deleteRole(role.id)}
                            title="Eliminar rol"
                            aria-label={`Eliminar ${role.nombre}`}
                            className="p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/20 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Ver Detalle / Crear / Editar con 2 Columnas (Izq: Permisos quemados, Der: Privilegios tipo switch) */}
      <RoleFormDrawer
        isOpen={drawerMode !== "closed"}
        mode={drawerMode === "closed" ? "view" : drawerMode}
        onClose={() => setDrawerMode("closed")}
        editingRole={editingRole}
        formNombre={formNombre}
        setFormNombre={setFormNombre}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formEstado={formEstado}
        setFormEstado={setFormEstado}
        rolePerms={draftPerms}
        onTogglePrivilege={toggleDraftPrivilege}
        onToggleGroupAll={toggleDraftGroupAll}
        onSave={handleSave}
        onSwitchToEdit={() => setDrawerMode("edit")}
      />
    </div>
  )
}
