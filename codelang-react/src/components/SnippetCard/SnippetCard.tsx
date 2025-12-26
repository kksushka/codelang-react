import { useNavigate } from 'react-router-dom'
import './SnippetCard.scss'
import type { Snippet } from '../../types/snippet'

interface Props {
  snippet: Snippet
}

const SnippetCard = ({ snippet }: Props) => {
  const navigate = useNavigate()

  const openPost = () => {
    navigate(`/snippets/${snippet.id}`, {
      state: { snippet },
    })
  }

  return (
    <div className="snippet-card" onClick={openPost}>
      <div className="snippet-header">
        <b>{snippet.user.username}</b>
        <span className="lang">{snippet.language}</span>
      </div>

      <pre className="snippet-code">{snippet.code}</pre>

      <div className="snippet-actions">
        <div className="left">
          <span>👍</span>
          <span>👎</span>
        </div>

        <div
          className="right"
          role="button"
          onClick={e => {
            e.stopPropagation()
            openPost()
          }}
        >
          💬 Comments
        </div>
      </div>
    </div>
  )
}

export default SnippetCard
