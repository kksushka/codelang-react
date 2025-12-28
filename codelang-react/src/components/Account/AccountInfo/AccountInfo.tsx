import type { User } from '../../../types/auth'
import type { Statistic } from '../../../types/account'
import './AccountInfo.scss'

interface AccountInfoProps {
  user: User
  statistic: Statistic | null
  statisticLoading: boolean
  onLogout: () => void
  onDelete: () => void
}

const AccountInfo = ({
  user,
  statistic,
  statisticLoading,
  onLogout,
  onDelete
}: AccountInfoProps) => {
  const getInitial = () => {
    if (!user.username) return 'U'
    return user.username.charAt(0).toUpperCase()
  }

  return (
    <div className="account-info">
      <div className="info-header">
        <div className="profile-image">
          <div className="avatar">{getInitial()}</div>
        </div>

        <div className="user-details">
          <h2 className="username">{user.username}</h2>

          <div className="user-meta">
            <span className="meta-item">
              <strong>ID:</strong> {user.id}
            </span>
            <span className="meta-item">
              <strong>Role:</strong> {user.role}
            </span>
          </div>

          <div className="action-buttons">
            <button className="btn btn-logout" onClick={onLogout}>
              Logout
            </button>
            <button className="btn btn-delete" onClick={onDelete}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Statistics</h3>

        {statisticLoading && (
          <div className="loading">Loading statistics...</div>
        )}

        {!statisticLoading && statistic && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{statistic.snippetsCount}</div>
              <div className="stat-label">Snippets Created</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{statistic.commentsCount}</div>
              <div className="stat-label">Comments Made</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{statistic.likesCount}</div>
              <div className="stat-label">Likes Received</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{statistic.dislikesCount}</div>
              <div className="stat-label">Dislikes Received</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">{statistic.questionsCount}</div>
              <div className="stat-label">Questions</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {statistic.correctAnswersCount} / {statistic.regularAnswersCount}
              </div>
              <div className="stat-label">Answers (Correct / Regular)</div>
            </div>
          </div>
        )}

        {!statisticLoading && !statistic && (
          <div className="error">Statistics not available</div>
        )}
      </div>
    </div>
  )
}

export default AccountInfo
