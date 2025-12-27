import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/api'
import type { CreateQuestionPayload } from '../../types/question'
import './CreateQuestionPage.scss'

const CreateQuestionPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<CreateQuestionPayload>({
    title: '',
    description: '',
    attachedCode: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Title is required')
      return
    }

    if (!form.description.trim()) {
      setError('Description is required')
      return
    }

    try {
      setLoading(true)

      await api.post('/questions', {
        title: form.title,
        description: form.description,
        attachedCode: form.attachedCode || undefined
      })

      navigate('/questions')
    } catch (err) {
      console.error('Failed to create question:', err)
      setError('Failed to create question')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-question-page">
      <div className="page-header">
        <h1>Ask a question</h1>

        <button
          className="close-btn"
          onClick={() => navigate(-1)}
          title="Close"
        >
          ✕
        </button>
      </div>

      <form className="question-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          name="title"
          placeholder="Question title"
          value={form.title}
          onChange={handleChange}
          disabled={loading}
        />

        <textarea
          name="description"
          placeholder="Question description"
          value={form.description}
          onChange={handleChange}
          disabled={loading}
          rows={4}
        />

        <label className="code-label">Attached Code:</label>

        <textarea
          name="attachedCode"
          className="code-editor"
          value={form.attachedCode}
          onChange={handleChange}
          disabled={loading}
          placeholder="// write your code here"
          rows={10}
        />

        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post question'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateQuestionPage
