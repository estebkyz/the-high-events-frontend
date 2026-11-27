import { clearResourceCache } from "./resourceCache"

export interface UserProfile {
  id?: string
  name: string
  email: string
  role?: string
  /** Códigos de privilegio del rol (`clientes.crear`). */
  permissions?: string[]
}

export interface Session {
  token: string
  user: UserProfile
}

const KEY = "the_high_events_session"

/** Único lugar donde se guarda la sesión ("Recordarme" → localStorage). */
export function saveSession(session: Session, remember: boolean): void {
  clearSession()
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(KEY, JSON.stringify(session))
}

export function loadSession(): Session | null {
  const raw = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as Partial<Session>
    return session.token && session.user ? (session as Session) : null
  } catch {
    return null
  }
}

/** Actualiza el perfil donde ya estaba guardada la sesión. */
export function updateSessionUser(user: UserProfile): void {
  updateSession({ user })
}

/** Actualiza la sesión guardada (perfil o token nuevo) sin cambiar dónde se guarda. */
export function updateSession(changes: Partial<Session>): void {
  const session = loadSession()
  if (!session) return
  const storage = sessionStorage.getItem(KEY) ? sessionStorage : localStorage
  storage.setItem(KEY, JSON.stringify({ ...session, ...changes }))
}

export function clearSession(): void {
  clearResourceCache()
  sessionStorage.removeItem(KEY)
  localStorage.removeItem(KEY)
}
