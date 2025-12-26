import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { api } from '../../api/api'
import { useAuth } from '../../hooks/useAuth'
import { 
  AccountInfo, 
  ProfileForm, 
  PasswordForm 
} from '../../components/Account'
import type { User } from '../../types/auth'
import './AccountPage.scss'

const AccountPage = () => {
  const navigate = useNavigate() 
  const { logout } = useAuth() 
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true)
        
        const response = await api.get<{ data: User }>('/me')
        const data = response.data.data || response.data
        setUserData(data)
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/') 
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      await api.delete('/me')
      await logout()
      window.location.href = '/'
    } catch {
      setError('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!userData) {
    return <div className="error-message">User not found</div>
  }

  return (
    <div className="account-page">
      <h1 className="welcome-title">Welcome, {userData.username}!</h1>
      
      <div className="account-container">
        <AccountInfo 
          user={userData}
          onLogout={handleLogout}
          onDelete={handleDeleteAccount}
        />
        
        <div className="forms-section">
          <ProfileForm 
            currentUsername={userData.username}
            onUpdate={setUserData}
          />
          
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}

export default AccountPage