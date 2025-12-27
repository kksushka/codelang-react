import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/api'
import { useAuth } from '../../context/AuthContext'
import type { Snippet, UpdateSnippetRequest } from '../../types/snippet'
import './EditSnippetPage.scss'

const EditSnippetPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [snippet, setSnippet] = useState<Snippet | null>(null)
    const [code, setCode] = useState('')
    const [language, setLanguage] = useState('')
    const [languages, setLanguages] = useState<string[]>([])

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!user) {
            setError('You need to be logged in to edit snippets')
            setIsLoading(false)
            return
        }

        fetchData()
    }, [id, user])

    const fetchData = async () => {
        try {
            setIsLoading(true)
            setError('')

            const [snippetRes, languagesRes] = await Promise.all([
                api.get(`/snippets/${id}`),
                api.get('/snippets/languages')
            ])

            const raw = snippetRes.data

            let fetchedSnippet: Snippet

            if (raw?.data?.data) {
                fetchedSnippet = raw.data.data
            } else if (raw?.data) {
                fetchedSnippet = raw.data
            } else {
                fetchedSnippet = raw
            }

            if (!fetchedSnippet.user) {
                throw new Error('Invalid snippet response')
            }

            if (fetchedSnippet.user.id !== user?.id) {
                setError('You are not allowed to edit this snippet')
                return
            }

            setSnippet(fetchedSnippet)
            setCode(fetchedSnippet.code)
            setLanguage(fetchedSnippet.language)
            const rawLanguages = languagesRes.data

            let langs: string[] = []

            if (Array.isArray(rawLanguages)) {
                langs = rawLanguages
            } else if (Array.isArray(rawLanguages?.data)) {
                langs = rawLanguages.data
            } else if (Array.isArray(rawLanguages?.data?.data)) {
                langs = rawLanguages.data.data
            }

            setLanguages(langs)

        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || err.message || 'Failed to load snippet')
        } finally {
            setIsLoading(false)
        }
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!code.trim()) {
            setError('Code cannot be empty')
            return
        }

        try {
            setIsSaving(true)
            setError('')

            const payload: UpdateSnippetRequest = {
                code,
                language
            }

            await api.patch(`/snippets/${id}`, payload)

            navigate('/my-snippets')
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || 'Failed to update snippet')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="edit-snippet-page">Loading...</div>
    }

    if (error && !snippet) {
        return (
            <div className="edit-snippet-page">
                <div className="error-message">{error}</div>
            </div>
        )
    }

    return (
        <div className="edit-snippet-page">
            <div className="page-header">
                <h1>Edit Snippet #{snippet?.id}</h1>
                <p>Update your code snippet</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form className="edit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Language</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        {languages.map(lang => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Code</label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        rows={14}
                        spellCheck={false}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate(-1)}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-save"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditSnippetPage
