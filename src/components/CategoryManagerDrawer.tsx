import { useState, type SubmitEvent } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { Drawer } from "@/components/Drawer"
import { DetailEmptyNote, DetailFooter, DetailList } from "@/components/detail"
import { useToast } from "@/components/Toast"
import { useCrudActions, type EntityLabel } from "@/hooks/useCrudActions"
import type { CrudResource } from "@/hooks/useCrudResource"
import type { CategoriaItem } from "@/types"

const CATEGORIA_LABEL: EntityLabel = {
  singular: "categoría",
  plural: "categorías",
  gender: "f",
}
const INPUT =
  "w-full h-[38px] px-3 bg-[#111318] border border-[#262D3D] rounded-xl text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED]"

interface CategoryManagerDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  placeholder: string
  categories: CrudResource<CategoriaItem>
  /** Registros que usan la categoría: si hay alguno, no se puede eliminar. */
  countUsage: (nombre: string) => number
  /** Propaga el cambio de nombre a los registros que la usan. */
  onRename: (previous: string, next: string) => Promise<unknown>
}

/** Administración del catálogo de categorías (servicios, equipos). */
export function CategoryManagerDrawer({
  isOpen,
  onClose,
  title,
  placeholder,
  categories,
  countUsage,
  onRename,
}: CategoryManagerDrawerProps) {
  const toast = useToast()
  const actions = useCrudActions(categories, CATEGORIA_LABEL, (c) => c.nombre)
  const [editing, setEditing] = useState<CategoriaItem | null>(null)
  const [form, setForm] = useState({ nombre: "", descripcion: "" })

  const resetForm = () => {
    setEditing(null)
    setForm({ nombre: "", descripcion: "" })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const startEdit = (category: CategoriaItem) => {
    setEditing(category)
    setForm({ nombre: category.nombre, descripcion: category.descripcion })
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nombre = form.nombre.trim()
    const descripcion = form.descripcion.trim()
    if (!nombre) return

    const isDuplicated = categories.items.some(
      (c) => c.id !== editing?.id && c.nombre.toLowerCase() === nombre.toLowerCase(),
    )
    if (isDuplicated) {
      toast.error("Ya existe una categoría con ese nombre")
      return
    }

    if (!editing) {
      if (await actions.create({ nombre, descripcion, estado: "Activo" })) resetForm()
      return
    }
    if (!(await actions.update(editing.id, { nombre, descripcion }))) return
    if (editing.nombre !== nombre) await onRename(editing.nombre, nombre)
    resetForm()
  }

  const handleDelete = (category: CategoriaItem) => {
    const usage = countUsage(category.nombre)
    if (usage > 0) {
      toast.error(
        `No se puede eliminar "${category.nombre}": tiene ${usage} registro(s) asociado(s)`,
      )
      return
    }
    void actions.remove(category)
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      position="center"
      title={title}
      footer={<DetailFooter onClose={handleClose} />}
    >
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 pb-4 border-b border-[#2D3748]"
      >
        <input
          type="text"
          required
          aria-label="Nombre de la categoría"
          placeholder={placeholder}
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          className={INPUT}
        />
        <input
          type="text"
          aria-label="Descripción de la categoría"
          placeholder="Descripción breve"
          value={form.descripcion}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          className={INPUT}
        />
        <button
          type="submit"
          disabled={actions.saving}
          className="h-[38px] px-4 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors cursor-pointer disabled:opacity-60"
        >
          {editing ? "Guardar" : "Crear"}
        </button>
      </form>

      {categories.items.length === 0 ? (
        <DetailEmptyNote text="Aún no hay categorías." />
      ) : (
        <DetailList>
          {categories.items.map((category) => (
            <div
              key={category.id}
              className="py-2.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC]">
                  {category.nombre}
                  <span className="ml-2 font-normal text-[#94A3B8]">
                    {countUsage(category.nombre)} en uso
                  </span>
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">
                  {category.descripcion}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                  aria-label={`Editar ${category.nombre}`}
                  className="p-2 text-[#94A3B8] hover:text-[#60A5FA] hover:bg-[#3B82F6]/15 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(category)}
                  aria-label={`Eliminar ${category.nombre}`}
                  className="p-2 text-[#94A3B8] hover:text-[#F87171] hover:bg-[#EF4444]/15 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </DetailList>
      )}
    </Drawer>
  )
}
