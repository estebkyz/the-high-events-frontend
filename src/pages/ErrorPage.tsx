import { Button } from "@/components/Button"

/** Error inesperado al mostrar una pantalla: permite recuperarse recargando. */
export default function ErrorPage() {
  return (
    <div
      role="alert"
      className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center p-6"
    >
      <h1 className="text-lg font-semibold text-ink">Algo salió mal</h1>
      <p className="text-[13px] text-ink-muted max-w-sm">
        No se pudo mostrar esta pantalla. Recarga la página; si el problema continúa,
        avisa al administrador.
      </p>
      <Button variant="primary" onClick={() => window.location.reload()}>
        Recargar
      </Button>
    </div>
  )
}
