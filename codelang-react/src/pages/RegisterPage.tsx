import { useState } from 'react'
import { api } from '../api/api'
import type { RegisterRequest } from '../types/auth'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterRequest>({
    username: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await api.post('/register', form)
      navigate('/login')
    } catch (err: any) {
      const data = err.response?.data
      console.log('VALIDATION ERRORS:', data)
      alert('Registration failed')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create account</h2>

        <div className="auth-field">
          <label>Username</label>
          <input
            placeholder="Choose username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="auth-field">
          <label>Confirm password</label>
          <input
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" type="submit">
          Register
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

export default Register
