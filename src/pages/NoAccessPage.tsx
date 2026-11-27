import { Lock } from "lucide-react"
import { Link } from "react-router-dom"

/** La persona no tiene el privilegio de la pantalla que abrió. */
export default function NoAccessPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
      <Lock size={28} aria-hidden="true" className="text-ink-muted" />
      <h1 className="text-lg font-semibold text-ink">No tienes acceso a esta sección</h1>
      <p className="text-[13px] text-ink-muted max-w-sm">
        Pide al administrador que agregue este permiso a tu rol.
      </p>
      <Link to="/" className="btn btn-primary">
        Ir al inicio
      </Link>
    </main>
  )
}
