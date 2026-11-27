import { useCallback } from "react"
import { Moon, Sun } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { FormSkeleton } from "@/components/form/FormSkeleton"
import { SegmentedControl } from "@/components/SegmentedControl"
import { useToast } from "@/components/Toast"
import { useTheme } from "@/hooks/useTheme"
import { PerfilDatosForm, SECCION } from "./components/PerfilDatosForm"
import type { PerfilForm } from "./types"
import { usePerfil } from "./usePerfil"

const TEMAS = [
  { label: "Claro", value: "light", icon: Sun },
  { label: "Oscuro", value: "dark", icon: Moon },
]

/** Perfil de la cuenta en uso: sus datos, su contraseña y el tema. */
export default function PerfilPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { isDarkMode, setTheme } = useTheme()
  const onError = useCallback((mensaje: string) => toast.error(mensaje), [toast])
  const { perfil, version, saving, guardar } = usePerfil(onError)

  const handleSave = async (form: PerfilForm) => {
    if (!perfil) return
    const r = await guardar(form, perfil)
    if (r)
      toast.success(r.token ? "Datos y contraseña actualizados" : "Datos actualizados")
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[760px] mx-auto w-full px-4 py-5 sm:px-6 space-y-4">
        <div>
          <h1 className="text-[20px] leading-7 font-semibold text-ink">Perfil</h1>
          <p className="text-xs text-ink-muted mt-0.5">
            Tus datos de acceso y cómo se ve la aplicación
          </p>
        </div>

        <section className={SECCION} aria-labelledby="perfil-apariencia">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 id="perfil-apariencia" className="text-[14px] font-semibold text-ink">
                Apariencia
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">Se guarda en este navegador</p>
            </div>
            <SegmentedControl
              label="Tema de la aplicación"
              value={isDarkMode ? "dark" : "light"}
              options={TEMAS}
              onChange={(v) => setTheme(v === "dark" ? "dark" : "light")}
            />
          </div>
        </section>

        {perfil ? (
          <PerfilDatosForm
            // Tras guardar, el formulario vuelve a partir de lo guardado (y limpia las contraseñas)
            key={version}
            perfil={perfil}
            saving={saving}
            onSave={(form) => void handleSave(form)}
            onError={onError}
            onCancel={() => void navigate(-1)}
          />
        ) : (
          <FormSkeleton />
        )}
      </div>
    </main>
  )
}
