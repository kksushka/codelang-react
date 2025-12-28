import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/api'
import './UsersPage.scss'
import type { User } from '../../types/account'

const UsersPage = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await api.get('/users')
      const raw = response.data

      let usersList: User[] = []

      if (Array.isArray(raw)) {
        usersList = raw
      } else if (Array.isArray(raw?.data)) {
        usersList = raw.data
      } else if (Array.isArray(raw?.data?.data)) {
        usersList = raw.data.data
      } else {
        throw new Error('Invalid users response format')
      }

      setUsers(usersList)
    } catch (err: any) {
      console.error('Failed to fetch users:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

if (isLoading) {
  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
        <p>Community members</p>
      </div>

      <div className="users-list">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="user-row skeleton">
            <div className="skeleton-username" />
            <div className="skeleton-role" />
          </div>
        ))}
      </div>
    </div>
  )
}

  if (error) {
    return (
      <div className="users-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
        <p>Community members</p>
      </div>

      {users.length === 0 ? (
        <div className="empty">No users found</div>
      ) : (
        <div className="users-list">
          {users.map(user => (
            <div
              key={user.id}
              className="user-row"
              onClick={() => navigate(`/users/${user.id}`)}
            >
              <span className="username">{user.username}</span>
              <span className={`role role-${user.role}`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UsersPage
