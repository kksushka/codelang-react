import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { socket } from '../services/socket'

import SnippetCard from '../components/SnippetCard'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

import type { Snippet } from '../types/snippet'
import type { Comment } from '../types/comment'

const SnippetPage = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  const [snippet, setSnippet] = useState<Snippet | null>(
    (location.state as any)?.snippet ?? null
  )
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    setLoading(true)

    Promise.all([
      snippet ? Promise.resolve(snippet) : api.get(`/snippets/${id}`).then(r => r.data),
      api.get('/comments', { params: { snippetId: id } }).then(r => r.data),
    ])
      .then(([snippetData, commentsData]) => {
        setSnippet(snippetData)
        setComments(Array.isArray(commentsData) ? commentsData : [])
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return

    socket.connect()
    socket.emit('join-snippet', id)

    socket.on('new-comment', (comment: Comment) => {
      setComments(prev => {
        if (prev.some(c => c.id === comment.id)) return prev
        return [...prev, comment]
      })
    })

    return () => {
      socket.emit('leave-snippet', id)
      socket.off('new-comment')
      socket.disconnect()
    }
  }, [id])

  if (loading) return <div>Loading post...</div>
  if (!snippet) return <div>Post not found</div>

  return (
    <div className="post-page">
      <SnippetCard snippet={snippet} />

      <CommentList comments={comments} />

      <CommentForm
        snippetId={snippet.id}
        onCreated={comment =>
          setComments(prev => [...prev, comment])
        }
      />
    </div>
  )
}

export default SnippetPage
