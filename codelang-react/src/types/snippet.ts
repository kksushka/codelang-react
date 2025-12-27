export interface Snippet {
  id: number
  language: string
  code: string
  user: {
    id: number
    username: string
    role: string
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface CreateSnippetRequest {
  code: string
  language: string
}

export interface UpdateSnippetRequest {
  code?: string
  language?: string
}

export interface SnippetListResponse {
  data: Snippet[]
  meta: {
    itemsPerPage: number
    totalItems: number
    currentPage: number
    totalPages: number
    sortBy: [string, string][]
    searchBy: string[]
    search: string
    select: string[]
    filter: Record<string, any>
  }
  links: {
    first: string
    previous: string
    current: string
    next: string
    last: string
  }
}

export interface MarkRequest {
  mark: 'like' | 'dislike'
}