export interface Comment {
  id: number
  content: string
  user: {
    id: number
    username: string
    role: string
  }
  snippetId?: number
  createdAt?: string
  updatedAt?: string
}