import type { User } from "./account"

export interface Question {
  id: number
  title: string
  description: string
  attachedCode?: string | null
  user: User
  answers: unknown[]
  isResolved: boolean
}

export interface QuestionsResponse {
  data: Question[]
}

export interface CreateQuestionPayload {
  title: string
  description: string
  attachedCode?: string
}
