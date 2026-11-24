const FALLBACK = "No se pudo conectar con el servidor"

/** `fetch` lanza TypeError cuando no hay red: se traduce a un mensaje legible. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof TypeError) return FALLBACK
  return err instanceof Error && err.message ? err.message : FALLBACK
}
