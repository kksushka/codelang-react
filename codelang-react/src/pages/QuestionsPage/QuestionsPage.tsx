import { useEffect, useState } from 'react'
import { api } from '../../api/api'
import type { Question } from '../../types/question'
import './QuestionsPage.scss'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const QuestionsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/questions', {
          params: { sortBy: 'id:DESC' },
        })

        const raw = response.data
        let questionsData: Question[] = []

        if (Array.isArray(raw?.data)) {
          questionsData = raw.data
        } else if (Array.isArray(raw?.data?.data)) {
          questionsData = raw.data.data
        }

        setQuestions(questionsData)
      } catch (err) {
        console.error('Failed to fetch questions:', err)
        setError('Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    navigate(`/questions/${id}/edit`)
  }

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setQuestionToDelete(id)
  }

  const handleDelete = async () => {
    if (!questionToDelete) return

    setIsDeleting(true)
    try {
      await api.delete(`/questions/${questionToDelete}`)
      setQuestions(prev => prev.filter(q => q.id !== questionToDelete))
      setQuestionToDelete(null)
    } catch (err) {
      console.error('Failed to delete question:', err)
      alert('Failed to delete question')
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="questions-page">
        <div className="questions-header">
          <h1 className="page-title">Questions</h1>
        </div>

        <div className="questions-list">
          {[1, 2, 3].map(i => (
            <div key={i} className="question-card skeleton">
              <div className="skeleton-title" />
              <div className="skeleton-meta" />
              <div className="skeleton-text" />
              <div className="skeleton-text short" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="questions-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="questions-page">
      <div className="questions-header">
        <h1 className="page-title">Questions</h1>

        {user && (
          <button
            className="ask-btn"
            onClick={() => navigate('/questions/create')}
          >
            Ask question
          </button>
        )}
      </div>

      <div className="questions-list">
        {questions.length === 0 && (
          <div className="empty-message">No questions yet</div>
        )}

        {questions.map(question => {
          const isOwner = user?.id === question.user?.id

          return (
            <div key={question.id} className="question-card">
              <h3 className="question-title">{question.title}</h3>

              <div className="question-meta">
                asked by{' '}
                <span className="username">
                  {question.user?.username ?? 'Unknown'}
                </span>
              </div>

              <div className="question-description">
                {question.description}
              </div>

              {isOwner && (
                <div className="question-actions">
                  <button
                    className="btn-edit"
                    onClick={(e) => handleEdit(e, question.id)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={(e) => handleDeleteClick(e, question.id)}
                    disabled={questionToDelete === question.id}
                  >
                    {questionToDelete === question.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {questionToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setQuestionToDelete(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Delete Question</h3>
            </div>

            <div className="modal-body">
              <p>
                Are you sure you want to delete{' '}
                <strong>Question #{questionToDelete}</strong>?
              </p>
              <p className="warning">This action cannot be undone.</p>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setQuestionToDelete(null)}
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

export default QuestionsPage
