import { useState } from 'react'
import type { User } from '../../../types/auth'
import { api } from '../../../api/api'
import './Forms.scss'

interface ProfileFormProps {
  currentUsername: string
  onUpdate: (user: User) => void
}

const ProfileForm = ({ currentUsername, onUpdate }: ProfileFormProps) => {
  const [username, setUsername] = useState(currentUsername || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (username === currentUsername) {
      setError('Username is the same as current')
      return
    }

    if (!username.trim()) {
      setError('Username cannot be empty')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await api.patch('/me', { username })

      if (response.data.updatedCount > 0) {
        setSuccess('Profile updated successfully')

        const userResponse = await api.get<{ data: User }>('/me')
        const userData = userResponse.data.data || userResponse.data

        onUpdate(userData)
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <h3>Edit Your Profile</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Change your username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
            disabled={loading}
            required
          />
        </div>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || username === currentUsername}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default ProfileForm