import { useState } from "react"
import { useConfirm } from "@/components/ConfirmDialog"
import { useToast } from "@/components/Toast"
import type { CrudResource } from "@/hooks/useCrudResource"
import { getErrorMessage } from "@/utils/errors"

export interface EntityLabel {
  /** En minúscula: "cliente", "cotización". */
  singular: string
  plural: string
  gender: "m" | "f"
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/**
 * Mutaciones con retroalimentación unificada: el toast de éxito sale solo cuando
 * el servidor confirma, y el de error cuando falla. Cada acción resuelve `true`
 * si se completó, para decidir si se cierra el modal.
 */
export function useCrudActions<T extends { id: string }>(
  resource: CrudResource<T>,
  entity: EntityLabel,
  getName: (item: T) => string,
) {
  const toast = useToast()
  const confirm = useConfirm()
  const [saving, setSaving] = useState(false)

  const name = capitalize(entity.singular)
  const isFeminine = entity.gender === "f"
  const ending = isFeminine ? "a" : "o"

  const run = async (
    operation: () => Promise<unknown>,
    notify: () => void,
  ): Promise<boolean> => {
    setSaving(true)
    try {
      await operation()
      notify()
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    } finally {
      setSaving(false)
    }
  }

  /** Resuelve el registro que devolvió el servidor o `null` si falló. */
  const save = async (
    operation: () => Promise<T>,
    message: string,
  ): Promise<T | null> => {
    const saved: T[] = []
    await run(
      async () => saved.push(await operation()),
      () => toast.success(message),
    )
    return saved[0] ?? null
  }

  const create = (data: Partial<Omit<T, "id">>) =>
    save(() => resource.createItem(data), `${name} cread${ending} exitosamente`)

  const update = (id: string, changes: Partial<T>, message?: string) =>
    save(
      () => resource.updateItem(id, changes),
      message ?? `${name} actualizad${ending} correctamente`,
    )

  const changeStatus = (id: string, changes: Partial<T>, estado: string) =>
    run(
      () => resource.updateItem(id, changes),
      () => toast.info(`Estado actualizado a ${estado}`),
    )

  const remove = async (item: T): Promise<boolean> => {
    const accepted = await confirm({
      title: `Eliminar ${entity.singular}`,
      message: `Se eliminará ${isFeminine ? "la" : "el"} ${entity.singular} "${getName(item)}". Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
    })
    if (!accepted) return false
    return run(
      () => resource.removeItem(item.id),
      () => toast.success(`${name} eliminad${ending}`),
    )
  }

  /** Aplica una operación a varios registros e informa cuántos fallaron. */
  const runMany = async (
    ids: string[],
    operation: (id: string) => Promise<unknown>,
    doneLabel: string,
  ): Promise<boolean> => {
    setSaving(true)
    const results = await Promise.allSettled(ids.map(operation))
    setSaving(false)
    const failed = results.filter((r) => r.status === "rejected").length
    const done = ids.length - failed
    if (done > 0) {
      toast.success(
        `${done} ${done === 1 ? entity.singular : entity.plural}: ${doneLabel}`,
      )
    }
    if (failed > 0) toast.error(`${failed} de ${ids.length} no se pudieron procesar`)
    return failed === 0
  }

  const updateMany = (ids: string[], changes: Partial<T>, doneLabel: string) =>
    runMany(ids, (id) => resource.updateItem(id, changes), doneLabel)

  const removeMany = async (ids: string[]): Promise<boolean> => {
    const accepted = await confirm({
      title: `Eliminar ${entity.plural}`,
      message: `Se eliminarán ${ids.length} ${entity.plural}. Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
    })
    return accepted ? runMany(ids, resource.removeItem, `eliminad${ending}s`) : false
  }

  return { saving, create, update, changeStatus, remove, updateMany, removeMany }
}
