import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { apiClient } from "@/services/apiClient"
import { perfilToPayload } from "./form"
import type { Perfil, PerfilForm, PerfilGuardado } from "./types"

/** Datos de la cuenta en uso: no es un listado, así que no usa `useCrudResource`. */
export function usePerfil(onError: (mensaje: string) => void) {
  const { refreshSession } = useAuth()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [saving, setSaving] = useState(false)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false
    apiClient
      .get<Perfil>("/perfil")
      .then((p) => !cancelled && setPerfil(p))
      .catch((e: Error) => !cancelled && onError(e.message))
    return () => {
      cancelled = true
    }
  }, [onError])

  /** Guarda y renueva la sesión (token nuevo si cambió la contraseña). */
  const guardar = useCallback(
    async (form: PerfilForm, actual: Perfil): Promise<PerfilGuardado | null> => {
      setSaving(true)
      try {
        const r = await apiClient.put<PerfilGuardado>(
          "/perfil",
          perfilToPayload(form, actual),
        )
        refreshSession(r.user, r.token)
        setPerfil(r.perfil)
        setVersion((v) => v + 1)
        return r
      } catch (e) {
        onError((e as Error).message)
        return null
      } finally {
        setSaving(false)
      }
    },
    [refreshSession, onError],
  )

  return { perfil, version, saving, guardar }
}
