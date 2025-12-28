import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../api/api'
import './UserPage.scss'
import type { UserWithStatistic } from '../../types/account'

const UserPage = () => {
  const { id } = useParams<{ id: string }>()

  const [user, setUser] = useState<UserWithStatistic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setError('Invalid user id')
      setIsLoading(false)
      return
    }

    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await api.get(`/users/${id}/statistic`)
      const raw = response.data

      let fetchedUser: UserWithStatistic | null = null

      if (raw?.data) {
        fetchedUser = raw.data
      } else {
        fetchedUser = raw
      }

      if (!fetchedUser || !fetchedUser.statistic) {
        throw new Error('Invalid user statistic response')
      }

      setUser(fetchedUser)
    } catch (err: any) {
      console.error('Failed to fetch user:', err)
      setError(err.response?.data?.message || err.message || 'Failed to load user')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading user...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-page">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const { statistic } = user

  return (
    <div className="user-page">
      <div className="profile-card">
        <div className="profile-header">
          <h1>{user.username}</h1>
          <span className={`role role-${user.role}`}>
            {user.role}
          </span>
        </div>

        <div className="stats-grid">
          <div className="stat">
            <span className="value">{statistic.snippetsCount}</span>
            <span className="label">Snippets</span>
          </div>

          <div className="stat">
            <span className="value">{statistic.rating}</span>
            <span className="label">Rating</span>
          </div>

          <div className="stat">
            <span className="value">{statistic.commentsCount}</span>
            <span className="label">Comments</span>
          </div>

          <div className="stat">
            <span className="value">
              {statistic.likesCount} / {statistic.dislikesCount}
            </span>
            <span className="label">Likes / Dislikes</span>
          </div>

          <div className="stat">
            <span className="value">{statistic.questionsCount}</span>
            <span className="label">Questions</span>
          </div>

          <div className="stat">
            <span className="value">
              {statistic.correctAnswersCount} / {statistic.regularAnswersCount}
            </span>
            <span className="label">Answers (Correct / Regular)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserPage
