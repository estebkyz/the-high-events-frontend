import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { apiClient } from "../services/apiClient"

export interface UserProfile {
  id?: string
  name: string
  email: string
  role?: string
}

interface LoginResponse {
  token: string
  user: UserProfile
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: UserProfile
  login: (email?: string, password?: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const EMPTY_USER: UserProfile = {
  name: "Usuario",
  email: "",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const raw = sessionStorage.getItem("auth_user")
      if (raw) return JSON.parse(raw)
    } catch {
      // ignore
    }
    return EMPTY_USER
  })

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem("auth_token"))
  })

  const login = useCallback(async (email?: string, password?: string) => {
    if (email && password) {
      const res = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      })
      sessionStorage.setItem("auth_token", res.token)
      sessionStorage.setItem("auth_user", JSON.stringify(res.user))
      localStorage.setItem("auth_token", res.token)
      setUser(res.user)
      setIsAuthenticated(true)
      return
    }
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem("auth_token")
    sessionStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
    setUser(EMPTY_USER)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, user, login, logout }),
    [isAuthenticated, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
  return ctx
}
