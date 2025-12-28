import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/api'
import type { Statistic } from '../../types/account'
import {
  AccountInfo,
  ProfileForm,
  PasswordForm
} from '../../components/Account'
import './AccountPage.scss'

const AccountPage = () => {
  const navigate = useNavigate()
  const { user, isLoading, logout, setUser } = useAuth()

  const [statistic, setStatistic] = useState<Statistic | null>(null)
  const [statLoading, setStatLoading] = useState(false)

useEffect(() => {
  if (!user?.id) return

  const fetchStatistic = async () => {
    try {
      setStatLoading(true)

      const response = await api.get(`/users/${user.id}/statistic`)
      const raw = response.data

      const statistic =
        raw?.statistic ??
        raw?.data?.statistic ??
        null

      setStatistic(statistic)
    } catch (err) {
      console.error('Failed to load statistic', err)
      setStatistic(null)
    } finally {
      setStatLoading(false)
    }
  }

  fetchStatistic()
}, [user?.id])


  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <div className="error-message">User not found</div>
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure?')) return

    await fetch('/me', { method: 'DELETE' })
    await logout()
    window.location.href = '/'
  }

  return (
    <div className="account-page">
      <h1 className="welcome-title">Welcome, {user.username}!</h1>

      <div className="account-container">
        <AccountInfo
          user={user}
          statistic={statistic}
          statisticLoading={statLoading}
          onLogout={handleLogout}
          onDelete={handleDeleteAccount}
        />

        <div className="forms-section">
          <ProfileForm
            currentUsername={user.username}
            onUpdate={setUser}
          />
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}

export default AccountPage
