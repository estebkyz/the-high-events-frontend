import { useState, type SubmitEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/Button"
import { FormInput } from "@/components/FormInput"
import { useAuth } from "@/context/AuthContext"
import { getErrorMessage } from "@/utils/errors"
import { EMPRESA } from "@/constants/empresa"

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

/** Al autenticarse, `LoginRoute` redirige al dashboard. */
export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState<LoginForm>({ email: "", password: "", remember: true })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const PasswordIcon = showPassword ? EyeOff : Eye

  const set = (changes: Partial<LoginForm>) => setForm((f) => ({ ...f, ...changes }))

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(form.email.trim(), form.password, form.remember)
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh w-full flex items-center justify-center p-4 bg-topbar bg-[radial-gradient(90%_70%_at_15%_0%,#6d28d9_0%,transparent_60%),radial-gradient(70%_60%_at_100%_100%,#4c1d95_0%,transparent_65%)] font-sans text-ink antialiased">
      <div className="w-full max-w-[420px] bg-surface rounded-2xl shadow-modal p-6 sm:p-9">
        <p className="flex items-center gap-2.5 text-[16px] font-semibold">
          <span
            aria-hidden="true"
            className="size-9 rounded-[10px] bg-brand text-white text-[13px] font-bold inline-flex items-center justify-center"
          >
            {EMPRESA.siglas}
          </span>
          {EMPRESA.nombre}
        </p>
        <h1 className="mt-7 text-[22px] leading-7 font-semibold">
          Panel de administración
        </h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          Ingresa con tu cuenta de {EMPRESA.nombre}.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          {error && (
            <p
              role="alert"
              className="p-3 rounded-lg bg-danger-soft text-[13px] text-danger-ink"
            >
              {error}
            </p>
          )}
          <FormInput
            id="login-email"
            label="Correo electrónico"
            type="email"
            autoComplete="username"
            required
            hideRequiredAsterisk
            placeholder="nombre@empresa.com"
            value={form.email}
            onChange={(e) => set({ email: e.target.value })}
          />
          <div className="relative">
            <FormInput
              id="login-password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              hideRequiredAsterisk
              value={form.password}
              onChange={(e) => set({ password: e.target.value })}
              className="!pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="icon-btn !size-7 absolute right-1.5 bottom-1.5 sm:bottom-1"
            >
              <PasswordIcon size={16} aria-hidden="true" />
            </button>
          </div>
          <label className="w-fit min-h-6 flex items-center gap-2 cursor-pointer text-[13px] text-ink-soft">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(e) => set({ remember: e.target.checked })}
              className="size-4 cursor-pointer"
            />
            Recordarme
          </label>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full min-h-10"
          >
            {loading ? "Verificando…" : "Iniciar sesión"}
          </Button>
          <p className="text-center text-xs text-ink-muted">
            ¿Olvidaste tu contraseña? Pídele al administrador que la restablezca.
          </p>
        </form>
      </div>
    </main>
  )
}
