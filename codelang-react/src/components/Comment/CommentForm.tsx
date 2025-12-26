import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'

interface Props {
  snippetId: number
}

const CommentForm = ({ snippetId }: Props) => {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) return <p>You must be logged in to comment</p>

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)

    try {
      await api.post('/comments', {
        content: text,
        snippetId,
      })
      setText('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button disabled={loading}>Send</button>
    </form>
  )
}

export default CommentForm
