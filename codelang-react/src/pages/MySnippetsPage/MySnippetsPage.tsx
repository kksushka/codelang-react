import { useEffect, useState } from 'react'
import { api } from '../../api/api'
import type { Snippet } from '../../types/snippet'
import SnippetStub from '../../components/SnippetStub/SnippetStub'
import './MySnippetsPage.scss'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MySnippetsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [snippetToDelete, setSnippetToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!user) {
      setError('You need to be logged in to view your snippets')
      setIsLoading(false)
      return
    }

    fetchMySnippets()
  }, [user])

  const fetchMySnippets = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await api.get('/snippets', {
        params: {
          userId: user?.id,
          sortBy: 'id:DESC',
        }
      })

      const data = response.data
      let snippetsList: Snippet[] = []

      if (data.data && Array.isArray(data.data)) {
        snippetsList = data.data
      } else if (Array.isArray(data)) {
        snippetsList = data
      } else if (data.data?.data && Array.isArray(data.data.data)) {
        snippetsList = data.data.data
      }

      setSnippets(snippetsList)
    } catch (err: any) {
      console.error('Failed to fetch snippets:', err)
      setError(err.response?.data?.message || 'Failed to load your snippets')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!snippetToDelete) return

    setIsDeleting(true)
    try {
      await api.delete(`/snippets/${snippetToDelete}`)
      setSnippets(prev => prev.filter(s => s.id !== snippetToDelete))
      setSnippetToDelete(null)
    } catch (err) {
      console.error('Failed to delete snippet:', err)
      alert('Failed to delete snippet')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleRefresh = () => {
    fetchMySnippets()
  }
const handleEdit = (e: React.MouseEvent, snippetId: number) => {
  e.stopPropagation()
  navigate(`/snippets/${snippetId}/edit`)
}

const openSnippet = (snippet: Snippet) => {
  navigate(`/snippets/${snippet.id}`)
}

  const handleDeleteClick = (e: React.MouseEvent, snippetId: number) => {
    e.stopPropagation()
    setSnippetToDelete(snippetId)
  }

  if (!user) {
    return (
      <div className="my-snippets-page">
        <div className="page-header">
          <h1 className="page-title">My Snippets</h1>
        </div>
        <div className="login-prompt">
          <p>You need to be logged in to view your snippets</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-snippets-page">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">My Snippets</h1>
          <p className="page-subtitle">Manage your code snippets</p>
        </div>

        <button
          className="btn-refresh"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="snippets-info">
        <div className="total-count">
          <span className="count-number">{snippets.length}</span>
          <span className="count-label">snippets</span>
        </div>
      </div>

      {isLoading ? (
        <div className="snippets-loading">
          {Array.from({ length: 5 }).map((_, i) => (
            <SnippetStub key={i} />
          ))}
        </div>
      ) : snippets.length === 0 ? (
        <div className="no-snippets">
          <div className="empty-state">
            <h3>No snippets yet</h3>
            <p>You haven't created any code snippets yet.</p>
            <button
              className="btn-create"
              onClick={() => navigate('/create')}
            >
              Create your first snippet
            </button>
          </div>
        </div>
      ) : (
        <div className="snippets-list">
          {snippets.map(snippet => (
            <div
              key={snippet.id}
              className={`snippet-card my-snippet-card ${snippetToDelete === snippet.id ? 'deleting' : ''}`}
              onClick={() => openSnippet(snippet)}
            >
              <div className="snippet-header">
                <div className="header-left">
                  <b>{snippet.user.username}</b>
                  <span className="lang">{snippet.language}</span>
                </div>
                <div className="header-right">
                  <span className="snippet-id">#{snippet.id}</span>
                </div>
              </div>

              <pre className="snippet-code">
                {snippet.code.length > 300
                  ? `${snippet.code.substring(0, 300)}...`
                  : snippet.code}
              </pre>

              <div className="snippet-actions">
                <div className="actions-left">
                  <button
                    className="btn-edit"
                    onClick={(e) => handleEdit(e, snippet.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={(e) => handleDeleteClick(e, snippet.id)}
                    disabled={snippetToDelete === snippet.id}
                  >
                    {snippetToDelete === snippet.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

                <div
                  className="actions-right"
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    openSnippet(snippet)
                  }}
                >
                  💬 Comments
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {snippetToDelete && (
        <div className="modal-overlay" onClick={() => setSnippetToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Snippet</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>Snippet #{snippetToDelete}</strong>?
              </p>
              <p className="warning">
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setSnippetToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MySnippetsPage