import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/api'

const EditQuestionPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [attachedCode, setAttachedCode] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await api.get(`/questions/${id}`)
                const q = res.data

                setTitle(q.title)
                setDescription(q.description)
                setAttachedCode(q.attachedCode || '')
            } catch {
                setError('Failed to load question')
            } finally {
                setLoading(false)
            }
        }

        fetchQuestion()
    }, [id])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !description.trim()) {
            alert('Title and description are required')
            return
        }

        try {
            await api.patch(`/questions/${id}`, {
                title,
                description,
                attachedCode,
            })

            navigate('/questions')
        } catch {
            alert('Failed to update question')
        }
    }

    if (loading) {
        return (
            <div className="page-loader">
                <div className="spinner" />
                <p>Loading question...</p>
            </div>
        )
    }
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="edit-question-page">
            <h1>Edit question</h1>

            <form onSubmit={handleSubmit} className="question-form">
                <label>
                    Title
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </label>

                <label>
                    Description
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={6}
                    />
                </label>

                <label>
                    Attached code
                    <textarea
                        value={attachedCode}
                        onChange={e => setAttachedCode(e.target.value)}
                        rows={6}
                    />
                </label>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditQuestionPage
