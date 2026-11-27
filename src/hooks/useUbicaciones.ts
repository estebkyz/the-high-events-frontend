import { useEffect, useState } from "react"
import { buscarUbicaciones, MIN_CARACTERES } from "@/services/ubicaciones"

const ESPERA_MS = 350

interface Resultado {
  query: string
  items: string[]
  failed: boolean
}

const VACIO: Resultado = { query: "", items: [], failed: false }

/** Sugerencias mientras se escribe. Con texto corto o vacío no consulta nada. */
export function useUbicaciones(texto: string) {
  const [resultado, setResultado] = useState<Resultado>(VACIO)
  const query = texto.trim()
  const activa = query.length >= MIN_CARACTERES

  useEffect(() => {
    if (!activa) return
    const controller = new AbortController()
    const load = async () => {
      try {
        const items = await buscarUbicaciones(query, controller.signal)
        if (!controller.signal.aborted) setResultado({ query, items, failed: false })
      } catch {
        if (!controller.signal.aborted) setResultado({ query, items: [], failed: true })
      }
    }
    const timer = setTimeout(() => void load(), ESPERA_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, activa])

  const alDia = activa && resultado.query === query
  return {
    activa,
    loading: activa && !alDia,
    failed: alDia && resultado.failed,
    // Mientras llega la respuesta nueva se conservan las anteriores, sin parpadeo.
    items: activa ? resultado.items : [],
  }
}
