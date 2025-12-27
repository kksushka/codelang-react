import './SnippetStub.scss'

const SnippetStub = () => {
  return (
    <div className="snippet-card snippet-stub">
      <div className="snippet-header">
        <div className="header-left">
          <div className="stub-line stub-user" />
          <div className="stub-line stub-lang" />
        </div>
        <div className="header-right">
          <div className="stub-line stub-id" />
        </div>
      </div>

      <div className="snippet-code">
        <div className="stub-line" />
        <div className="stub-line" />
        <div className="stub-line short" />
        <div className="stub-line" />
        <div className="stub-line short" />
      </div>

      <div className="snippet-actions">
        <div className="actions-left">
          <div className="stub-line stub-button" />
          <div className="stub-line stub-button" />
        </div>
        <div className="actions-right">
          <div className="stub-line stub-comments" />
        </div>
      </div>
    </div>
  )
}

export default SnippetStub