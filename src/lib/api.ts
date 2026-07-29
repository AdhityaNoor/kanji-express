import type { PublicUser } from './types'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  let data: unknown = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    if (data && typeof data === 'object' && 'error' in data) {
      message = String((data as { error: unknown }).error)
    }
    throw new ApiError(res.status, message)
  }
  return data as T
}

interface UserResponse {
  user: PublicUser
}

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<UserResponse>('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

  login: (email: string, password: string) =>
    request<UserResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => request<{ ok: true }>('/auth/logout', { method: 'POST' }),

  me: () => request<UserResponse>('/auth/me'),

  getProfile: () => request<UserResponse>('/profile'),

  updateProfile: (patch: { name?: string; jlptTarget?: string }) =>
    request<UserResponse>('/profile', { method: 'PATCH', body: JSON.stringify(patch) }),

  completeLesson: (payload: {
    level: string
    section: string
    lessonIndex: number
    correct: number
    total: number
  }) => request<UserResponse & { awarded: { key: string; xp: number; streak: number } }>('/progress/complete', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
