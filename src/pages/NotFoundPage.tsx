import { Link } from "react-router-dom"

/** Se muestra cuando la URL no coincide con ninguna ruta privada. */
export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
      <p className="text-[48px] font-semibold text-brand-ink leading-none">404</p>
      <h1 className="text-lg font-semibold text-ink">Página no encontrada</h1>
      <p className="text-[13px] text-ink-muted max-w-sm">
        La dirección que buscas no existe o fue movida.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
