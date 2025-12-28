import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { RegisterRequest } from '../../types/auth'
import { api } from '../../api/api'
import { registerSchema } from '../../validation/auth.schema'
import './auth.scss'

const Register = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterRequest>({
    username: '',
    password: '',
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validation = registerSchema.safeParse({
      username: form.username,
      password: form.password,
      confirmPassword,
    })

    if (!validation.success) {
      setError(validation.error.issues[0].message)
      return
    }

    try {
      await api.post('/register', form)
      navigate('/login')
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Registration failed'
      )
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
            onChange={e =>
              setForm({ ...form, username: e.target.value })
            }
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
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

        {error && <div className="auth-error">{error}</div>}

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
