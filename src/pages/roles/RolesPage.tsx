import React, { useState } from "react"
import { PageHeader } from "../../components/PageHeader"
import { INITIAL_ROLES, buildInitialPerms } from "./data"
import { RolesMatrixTable } from "./components/RolesMatrixTable"
import { RoleFormDrawer } from "./drawers/RoleFormDrawer"
import type { Rol, PermsMap } from "./types"

export default function RolesPage() {
  const [roles, setRoles] = useState<Rol[]>(INITIAL_ROLES)
  const [perms, setPerms] = useState<PermsMap>(buildInitialPerms)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Rol | null>(null)
  const [formNombre, setFormNombre] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formEstado, setFormEstado] = useState<"Activo" | "Inactivo">("Activo")

  const togglePerm = (roleId: string, privId: string) => {
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

  const openCreate = () => {
    setEditingRole(null)
    setFormNombre("")
    setFormDesc("")
    setFormEstado("Activo")
    setDrawerOpen(true)
  }

  const openEdit = (role: Rol) => {
    setEditingRole(role)
    setFormNombre(role.nombre)
    setFormDesc(role.descripcion)
    setFormEstado(role.estado)
    setDrawerOpen(true)
  }

  const deleteRole = (roleId: string) => {
    if (!confirm("¿Eliminar este rol?")) return
    setRoles((p) => p.filter((r) => r.id !== roleId))
    setPerms((p) => {
      const n = { ...p }
      delete n[roleId]
      return n
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNombre.trim()) return
    if (editingRole) {
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
    } else {
      const id = String(Date.now())
      setRoles((p) => [
        ...p,
        {
          id,
          nombre: formNombre.trim(),
          descripcion: formDesc.trim(),
          usuariosCount: 0,
          estado: formEstado,
        },
      ])
      setPerms((p) => ({ ...p, [id]: new Set<string>() }))
    }
    setDrawerOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#111318]">
      <main className="flex-1 overflow-y-auto p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Top Bar */}
        <PageHeader
          title="Roles"
          actionLabel="Crear rol"
          onAction={openCreate}
        />

        {/* Matrix Table */}
        <RolesMatrixTable
          roles={roles}
          perms={perms}
          onTogglePerm={togglePerm}
          onEditRole={openEdit}
          onDeleteRole={deleteRole}
        />
      </main>

      {/* Create / Edit Drawer */}
      <RoleFormDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        editingRole={editingRole}
        formNombre={formNombre}
        setFormNombre={setFormNombre}
        formDesc={formDesc}
        setFormDesc={setFormDesc}
        formEstado={formEstado}
        setFormEstado={setFormEstado}
        onSave={handleSave}
      />
    </div>
  )
}
