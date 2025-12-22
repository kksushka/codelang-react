import type { Snippet } from '../types/snippet'

interface SnippetCardProps {
  snippet: Snippet
}

const SnippetCard = ({ snippet }: SnippetCardProps) => {
  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <b>{snippet.user.username}</b>
        <span className="lang">{snippet.language}</span>
      </div>

      <pre className="snippet-code">{snippet.code}</pre>

      <div className="snippet-actions">
        👍 0 👎 0
      </div>
    </div>
  )
}

export default SnippetCard
