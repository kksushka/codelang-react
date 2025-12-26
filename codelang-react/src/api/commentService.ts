import { api } from './api'
import type { Comment } from '../types/comment'

export const getComments = async (snippetId: number) => {
  const res = await api.get<Comment[]>('/comments', {
    params: { snippetId },
  })
  return res.data
}
