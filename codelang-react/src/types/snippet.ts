export interface Snippet {
  id: number
  code: string
  language: string
  user: {
    id: number
    username: string
    role: string
  }
}

export interface SnippetsResponse {
  data: Snippet[]
  meta: {
    itemsPerPage: number
    totalItems: number
    currentPage: number
    totalPages: number
  }
}
