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

export interface LoginResponse {
  data: {
    id: number
    username: string
    role: 'user' | 'admin'
    token: string
  }
  message: string
}

export interface ApiResponse<T> {
  data: T
  message: string
}