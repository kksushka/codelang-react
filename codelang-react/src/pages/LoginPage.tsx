import { useState } from 'react'
import { api } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { LoginRequest, User } from '../types/auth'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [form, setForm] = useState<LoginRequest>({
    username: '',
    password: ''
  })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await api.post<User>('/auth/login', form)
      setUser(res.data)
      navigate('/')
    } catch {
      alert('Login failed')
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
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className="auth-button" type="submit">
          Sign in
        </button>

        <p className="auth-footer">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  )
}

export default Login
