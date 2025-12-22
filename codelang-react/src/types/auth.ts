export interface User {
  id: number
  username: string
  role: 'user' | 'admin'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}
