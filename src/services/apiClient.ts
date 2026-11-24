import { loadSession } from "@/services/session"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

/** Se emite cuando la API rechaza el token; `AuthProvider` cierra la sesión. */
export const SESSION_EXPIRED_EVENT = "session-expired"

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function readError(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null)
  if (body && typeof body === "object" && "message" in body) return String(body.message)
  return `Error HTTP ${response.status}`
}

async function request<T>(method: string, endpoint: string, body?: unknown): Promise<T> {
  const token = loadSession()?.token
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
    }
    throw new ApiError(await readError(response), response.status)
  }

  // 204 y DELETE pueden llegar sin cuerpo.
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>("GET", endpoint),
  post: <T>(endpoint: string, body: unknown) => request<T>("POST", endpoint, body),
  put: <T>(endpoint: string, body: unknown) => request<T>("PUT", endpoint, body),
  delete: (endpoint: string) => request<void>("DELETE", endpoint),
}
