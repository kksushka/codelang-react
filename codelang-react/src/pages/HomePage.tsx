import { useEffect, useState } from 'react'
import { api } from '../api/api'
import type { Snippet } from '../types/snippet'
import SnippetStub from '../components/SnippetStub/SnippetStub'
import SnippetCard from '../components/SnippetCard/SnippetCard'

const Home = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    api
      .get('/snippets')
      .then(res => {
        const list = res.data?.data?.data
        setSnippets(Array.isArray(list) ? list : [])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <>
      <h1 className="welcome">Welcome to Codelang!</h1>

      {isLoading &&
        Array.from({ length: 5 }).map((_, i) => (
          <SnippetStub key={i} />
        ))}

      {!isLoading &&
        snippets.map(snippet => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
    </>
  )
}

export default Home
