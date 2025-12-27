import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/api'
import type { CreateSnippetRequest } from '../../types/snippet'
import './CreateSnippetPage.scss'
import { LanguageSelect, SnippetEditor } from '../../components/Snippets'

const CreateSnippetPage = () => {
  const navigate = useNavigate()
  
  const [form, setForm] = useState<CreateSnippetRequest>({
    code: '',
    language: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([])
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true)

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await api.get<{ data: string[] }>('/snippets/languages')
        
        const languages = response.data.data || []
        
        setAvailableLanguages(languages)
        
        if (languages.length > 0 && !form.language) {
          setForm(prev => ({ ...prev, language: languages[0] }))
        }
      } catch (err) {
        console.error('Failed to load languages:', err)
        setAvailableLanguages(['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'HTML', 'CSS'])
        
        if (!form.language) {
          setForm(prev => ({ ...prev, language: 'JavaScript' }))
        }
      } finally {
        setIsLoadingLanguages(false)
      }
    }

    loadLanguages()
  }, [])

  const handleCodeChange = (code: string) => {
    setForm(prev => ({ ...prev, code }))
  }

  const handleLanguageChange = (language: string) => {
    setForm(prev => ({ ...prev, language }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.code.trim()) {
      setError('Code cannot be empty')
      return
    }

    if (!form.language) {
      setError('Please select a language')
      return
    }

    try {
      setLoading(true)
      
      console.log('Submitting snippet:', form)
      
      const response = await api.post<{ data: any }>('/snippets', {
        code: form.code,
        language: form.language
      })
      
      console.log('Snippet created successfully:', response.data)
      
      const snippetData = response.data.data
      
      if (snippetData && snippetData.id) {
        const snippetId = snippetData.id
        console.log('Snippet ID:', snippetId)
        
        navigate('/my-snippets')
      } else {
        console.error('No snippet ID in response:', response.data)
        setError('Failed to create snippet: No ID returned')
      }
      
    } catch (err: any) {
      console.error('Failed to create snippet:', err)
      console.error('Error details:', err.response?.data)
      
      let errorMessage = 'Failed to create snippet'
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.status === 422) {
        errorMessage = 'Validation error. Please check your input.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-snippet-page">
      <h1 className="page-title">Create new snippet</h1>
      
      <form className="snippet-form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-section">
          <label className="section-label">Language of your snippet</label>
          <LanguageSelect
            languages={availableLanguages}
            selectedLanguage={form.language}
            onChange={handleLanguageChange}
            loading={isLoadingLanguages}
          />
        </div>

        <div className="form-section">
          <label className="section-label">Code of your snippet</label>
          <SnippetEditor
            code={form.code}
            language={form.language}
            onChange={handleCodeChange}
            placeholder="Write your code here..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !form.code.trim() || !form.language}
          >
            {loading ? 'Creating...' : 'Create Snippet'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSnippetPage