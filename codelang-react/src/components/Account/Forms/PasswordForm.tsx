import { useState } from 'react'
import { api } from '../../../api/api'
import './Forms.scss'


const PasswordForm = () => {
  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const response = await api.patch('/me/password', {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword
      })

      if (response.data.updatedCount > 0) {
        setSuccess('Password changed successfully')
        setForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to change password'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card">
      <h3>Change Your Password</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Current Password</label>
          <input
            id="oldPassword"
            name="oldPassword"
            type="password"
            value={form.oldPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            disabled={loading}
          />
        </div>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  )
}

export default PasswordForm