import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { api } from '../api/api'
import type { Snippet } from '../types/snippet'
import type { Comment } from '../types/comment'
import { getComments } from '../api/commentService'
import SnippetCard from '../components/SnippetCard/SnippetCard'
import CommentList from '../components/Comment/CommentList'
import CommentForm from '../components/Comment/CommentForm'

const POLL_INTERVAL = 3000 

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
      snippet
        ? Promise.resolve(snippet)
        : api.get(`/snippets/${id}`).then(r => r.data),
      getComments(Number(id)),
    ])
      .then(([snippetData, commentsData]) => {
        setSnippet(snippetData)
        setComments(commentsData)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return

    const interval = setInterval(async () => {
      const fresh = await getComments(Number(id))
      setComments(fresh)
    }, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [id])

  if (loading) return <div>Loading post...</div>
  if (!snippet) return <div>Post not found</div>

  return (
    <div className="post-page">
      <SnippetCard snippet={snippet} />
      <CommentList comments={comments} />
      <CommentForm snippetId={snippet.id} />
    </div>
  )
}

export default SnippetPage
