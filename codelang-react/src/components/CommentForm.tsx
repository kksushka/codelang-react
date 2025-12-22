import { useState } from 'react'
import { api } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import type { Comment } from '../types/comment'

interface Props {
  snippetId: number
  onCreated: (comment: Comment) => void
}

const CommentForm = ({ snippetId, onCreated }: Props) => {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) return <p>You must be logged in to comment</p>

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)

    try {
      const res = await api.post<Comment>('/comments', {
        content: text,
        snippetId,
      })

      onCreated(res.data)
      setText('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="comment-form" onSubmit={submit}>
      <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        Send
      </button>
    </form>
  )
}

export default CommentForm
