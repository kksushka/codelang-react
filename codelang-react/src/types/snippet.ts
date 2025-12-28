import type { CommentDto } from './comment'

export interface Snippet {
  id: number
  code: string
  language: string
  user: {
    id: number
    username: string
  }
  comments?: CommentDto[]
  marks: Mark[]
  likesCount: number
  dislikesCount: number
  myMark?: MarkType

}
export type MarkType = 'like' | 'dislike'
export interface Mark {
  id: number
  type: MarkType
  user: {
    id: number
    username: string
  }
}