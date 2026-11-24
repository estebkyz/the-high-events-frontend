import type { EntityLabel } from "@/hooks/useCrudActions"

export const USUARIO_LABEL: EntityLabel = {
  singular: "usuario",
  plural: "usuarios",
  gender: "m",
}

export const USUARIO_FILTERS = { rol: "Rol", estado: "Estado" }

export const MIN_PASSWORD_LENGTH = 6
