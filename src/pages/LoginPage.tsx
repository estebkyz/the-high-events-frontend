import { useState, type SubmitEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { getErrorMessage } from "@/utils/errors"

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

const LABEL = "text-[13px] font-semibold text-[#F1F5F9] block mb-1.5"
const INPUT =
  "w-full h-[44px] px-4 bg-[#242830] border border-[#2D3748] rounded-xl text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/40 transition-all"

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
    <main className="flex min-h-screen w-full bg-[#0B0D11] font-['Inter',sans-serif] text-[#F1F5F9]">
      <div className="hidden md:flex md:w-1/2 bg-[#111318] flex-col justify-center px-14 py-16 relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#7C3AED]/10 to-transparent"
        />
        <BrandMark />
        <p className="mt-14 text-[64px] xl:text-[80px] font-black leading-none tracking-tight">
          The High
          <span className="block text-[#7C3AED]">Events</span>
        </p>
        <p className="mt-4 text-[15px] text-[#94A3B8] max-w-xs">
          Sistema de gestión de eventos y producción
        </p>
      </div>

      <div className="flex-1 bg-[#1A1D23] flex flex-col items-center justify-center px-6 py-12">
        <div className="md:hidden mb-10">
          <BrandMark />
        </div>
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-1">
            <h1 className="text-[26px] font-bold tracking-tight">
              Panel de administración
            </h1>
            <p className="text-[13px] text-[#94A3B8]">
              Ingresa con tu cuenta de The High Events.
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            {error && (
              <p
                role="alert"
                className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-xs text-[#FCA5A5]"
              >
                {error}
              </p>
            )}
            <div>
              <label htmlFor="login-email" className={LABEL}>
                Correo electrónico
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                required
                placeholder="usuario@thehighevents.com"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                className={INPUT}
              />
            </div>
            <div>
              <label htmlFor="login-password" className={LABEL}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => set({ password: e.target.value })}
                  className={`${INPUT} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <PasswordIcon size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-[#94A3B8] text-[12px]">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => set({ remember: e.target.checked })}
                className="accent-[#7C3AED] cursor-pointer"
              />
              Recordarme
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[46px] bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-xl text-[13px] transition-all cursor-pointer"
            >
              {loading ? "Verificando…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

function BrandMark() {
  return (
    <div
      aria-hidden="true"
      className="w-16 h-16 rounded-2xl bg-[#7C3AED] flex items-center justify-center font-black text-white text-[28px] shadow-[0_0_40px_rgba(124,58,237,0.45)]"
    >
      TH
    </div>
  )
}
