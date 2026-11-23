/**
 * Adaptadores entre las tablas de MySQL Workbench y las interfaces del Frontend.
 * Resuelven automáticamente:
 * 1. Nombres compuestos: MySQL guarda `nombre` y `apellido` en un solo campo,
 *    mientras el frontend divide en `primer_nombre`/`segundo_nombre` y `primer_apellido`/`segundo_apellido`.
 * 2. Estados booleanos: MySQL usa `TINYINT(1)` (1 / 0) en `estado` o `activo`,
 *    mientras el frontend usa `"Activo" | "Inactivo"`.
 * 3. Llaves primarias: MySQL usa `id_cliente`, `id_usuario`, `id_rol`, etc.,
 *    mientras el frontend usa `id: string`.
 */

export function splitFullName(
  nombreDb?: string | null,
  apellidoDb?: string | null,
) {
  const nombres = (nombreDb || "").trim().split(/\s+/)
  const apellidos = (apellidoDb || "").trim().split(/\s+/)
  return {
    primer_nombre: nombres[0] || "",
    segundo_nombre: nombres.slice(1).join(" ") || "",
    primer_apellido: apellidos[0] || "",
    segundo_apellido: apellidos.slice(1).join(" ") || "",
  }
}

export function joinFullName(
  primerNombre?: string,
  segundoNombre?: string,
  primerApellido?: string,
  segundoApellido?: string,
) {
  const nombre = [primerNombre, segundoNombre]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(" ")
  const apellido = [primerApellido, segundoApellido]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(" ")
  return { nombre, apellido }
}

export function tinyIntToEstado(val: number | boolean | string | undefined): "Activo" | "Inactivo" {
  if (val === "Activo" || val === 1 || val === true || val === "1") {
    return "Activo"
  }
  return "Inactivo"
}

export function estadoToTinyInt(estado?: string | boolean | number): number {
  if (estado === "Activo" || estado === true || estado === 1) {
    return 1
  }
  return 0
}
