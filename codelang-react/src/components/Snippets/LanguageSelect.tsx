import { useState, useEffect } from 'react'

interface LanguageSelectProps {
  languages: string[]
  selectedLanguage: string
  onChange: (language: string) => void
  loading?: boolean
  disabled?: boolean
}

const LanguageSelect = ({
  languages,
  selectedLanguage,
  onChange,
  loading = false,
  disabled = false
}: LanguageSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    console.log('LanguageSelect - languages:', languages)
    console.log('LanguageSelect - selectedLanguage:', selectedLanguage)
    console.log('LanguageSelect - disabled:', disabled)
  }, [languages, selectedLanguage, disabled])

  const handleSelect = (language: string) => {
    if (disabled) return

    console.log('Language selected:', language)
    onChange(language)
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (disabled) return

    setIsOpen(!isOpen)
  }

  if (loading) {
    return (
      <div className="language-select loading disabled">
        <div className="select-placeholder">Loading languages...</div>
      </div>
    )
  }

  const validLanguages = Array.isArray(languages) ? languages : []
  console.log('LanguageSelect - validLanguages:', validLanguages)

  return (
    <div className={`language-select ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
      <div
        className="select-header"
        onClick={handleToggle}
      >
        <span className="selected-value">
          {selectedLanguage || 'Select a language'}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && !disabled && (
        <div className="select-dropdown">
          {validLanguages.length === 0 ? (
            <div className="dropdown-item empty">No languages available</div>
          ) : (
            validLanguages.map(language => (
              <div
                key={language}
                className={`dropdown-item ${selectedLanguage === language ? 'selected' : ''}`}
                onClick={() => handleSelect(language)}
              >
                {language}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default LanguageSelect