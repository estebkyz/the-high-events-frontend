/** Error inesperado al mostrar una pantalla: permite recuperarse recargando. */
export default function ErrorPage() {
  return (
    <div
      role="alert"
      className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center p-6"
    >
      <h1 className="text-lg font-semibold text-[#F8FAFC]">Algo salió mal</h1>
      <p className="text-xs text-[#94A3B8] max-w-sm">
        No se pudo mostrar esta pantalla. Recarga la página; si el problema continúa,
        avisa al administrador.
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-colors cursor-pointer"
      >
        Recargar
      </button>
    </div>
  )
}
