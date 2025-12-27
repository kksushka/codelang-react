import { useRef, useEffect } from 'react'

interface SnippetEditorProps {
  code: string
  language: string
  onChange: (code: string) => void
  placeholder?: string
  height?: string
}

const SnippetEditor = ({ 
  code, 
  language, 
  onChange, 
  placeholder = '',
  height = '400px'
}: SnippetEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.max(textarea.scrollHeight, parseInt(height))
      textarea.style.height = `${newHeight}px`
    }
  }, [code, height])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      
      onChange(newCode)
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className="snippet-editor">
      <div className="editor-header">
        <span className="language-badge">{language || 'text'}</span>
        <span className="char-count">{code.length} characters</span>
      </div>
      <textarea
        ref={textareaRef}
        className="code-textarea"
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{ minHeight: height }}
        spellCheck="false"
      />
    </div>
  )
}

export default SnippetEditor