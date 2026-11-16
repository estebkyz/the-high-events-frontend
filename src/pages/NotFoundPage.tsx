import { Link } from "react-router-dom"
import { ROUTE_PATHS } from "../routes/paths"

/** Se muestra cuando la URL no coincide con ninguna ruta privada. */
export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-6">
      <p className="text-[48px] font-bold text-[#A78BFA] leading-none">404</p>
      <h1 className="text-lg font-semibold text-[#F8FAFC]">
        Página no encontrada
      </h1>
      <p className="text-xs text-[#94A3B8] max-w-sm">
        La dirección que buscas no existe o fue movida.
      </p>
      <Link
        to={ROUTE_PATHS.dashboard}
        className="mt-2 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-colors"
      >
        Volver al dashboard
      </Link>
    </div>
  )
}
