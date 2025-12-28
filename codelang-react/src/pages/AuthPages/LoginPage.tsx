import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { LoginRequest, User } from '../../types/auth'
import { api } from '../../api/api'
import { loginSchema } from '../../validation/auth.schema'
import './auth.scss'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState<LoginRequest>({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const validation = loginSchema.safeParse(form)

    if (!validation.success) {
      setError(validation.error.issues[0].message)
      return
    }

    try {
      const res = await api.post<{ data: User }>('/auth/login', form)
      login(res.data.data)
      navigate('/')
    } catch {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2>Sign in</h2>

        <div className="auth-field">
          <label>Username</label>
          <input
            placeholder="Enter username"
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
            placeholder="Enter password"
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-button" type="submit">
          Login
        </button>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
