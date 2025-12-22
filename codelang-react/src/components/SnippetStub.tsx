const SnippetStub = () => {
  return (
    <div className="snippet-card snippet-stub">
      <div className="snippet-header">
        <div className="stub-line stub-user" />
        <div className="stub-line stub-lang" />
      </div>

      <div className="snippet-code">
        <div className="stub-line" />
        <div className="stub-line" />
        <div className="stub-line short" />
      </div>

      <div className="snippet-actions">
        <div className="stub-line small" />
      </div>
    </div>
  )
}

export default SnippetStub
