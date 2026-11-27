/**
 * Última respuesta de cada listado mientras la pestaña está abierta: al volver a un
 * módulo se muestra al instante y se actualiza por detrás. Nunca se guarda en disco.
 */
const lists = new Map<string, unknown[]>()
const pending = new Map<string, Promise<unknown[]>>()
let session = 0

export function getCached<T>(endpoint: string): T[] | undefined {
  return lists.get(endpoint) as T[] | undefined
}

export function setCached<T>(endpoint: string, items: T[]): void {
  lists.set(endpoint, items)
}

/** Dos pantallas que piden lo mismo a la vez comparten la petición. */
export function loadShared<T>(endpoint: string, load: () => Promise<T[]>): Promise<T[]> {
  const current = pending.get(endpoint)
  if (current) return current as Promise<T[]>
  const started = session
  const request = load()
    .then((items) => {
      if (started === session) lists.set(endpoint, items)
      return items
    })
    .finally(() => {
      if (pending.get(endpoint) === request) pending.delete(endpoint)
    })
  pending.set(endpoint, request)
  return request
}

/** Al cerrar sesión: la siguiente persona no puede ver datos de la anterior. */
export function clearResourceCache(): void {
  session += 1
  lists.clear()
  pending.clear()
}
