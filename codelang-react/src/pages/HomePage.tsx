import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Snippet } from '../types/snippet'

const Home = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])

  useEffect(() => {
    api.get('/snippets').then(res => {
      const list = res.data?.data?.data
      setSnippets(Array.isArray(list) ? list : [])
    })
  }, [])

  return (
    <>
      <h1 className="welcome">Welcome to Codelang!</h1>

      {snippets.map(snippet => (
        <div key={snippet.id} className="snippet-card">
          <div className="snippet-header">
            <b>{snippet.user.username}</b>
            <span className="lang">{snippet.language}</span>
          </div>

          <pre className="snippet-code">{snippet.code}</pre>

          <div className="snippet-actions">
            👍 0 👎 0
          </div>
        </div>
      ))}
      </>
  )
}

export default Home
