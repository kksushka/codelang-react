import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/api'
import type { Question } from '../../types/question'
import './QuestionsPage.scss'

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/questions', {
          params: {
            sortBy: 'id:DESC',
          },
        })
        const raw = response.data

        let questionsData: unknown

        if (Array.isArray(raw?.data)) {
          questionsData = raw.data
        } else if (Array.isArray(raw?.data?.data)) {
          questionsData = raw.data.data
        } else {
          throw new Error('Invalid questions response format')
        }

        setQuestions(questionsData as Question[])
      } catch (err) {
        console.error('Failed to fetch questions:', err)
        setError('Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  if (loading) {
    return <div className="questions-page">Loading...</div>
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

        <button
          className="ask-btn"
          onClick={() => navigate('/questions/create')}
        >
          Ask question
        </button>
      </div>

      <div className="questions-list">
        {questions.length === 0 && (
          <div className="empty-message">No questions yet</div>
        )}

        {questions.map(question => (
          <div key={question.id} className="question-card">
            <h3 className="question-title">{question.title}</h3>

            <div className="question-meta">
              asked by user:{' '}
              <span className="username">
                {question.user?.username ?? 'Unknown'}
              </span>
            </div>

            <div className="question-description">
              {question.description}
            </div>

            <div className="question-actions">
              <button
                className="view-btn"
                onClick={() => navigate(`/questions/${question.id}`)}
                title="View question"
              >
                👁
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionsPage
