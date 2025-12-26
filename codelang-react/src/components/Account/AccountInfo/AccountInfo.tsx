import type { User } from "../../../types/auth"
import './AccountInfo.scss'

interface AccountInfoProps {
  user: User | null
  onLogout: () => void
  onDelete: () => void
}

const AccountInfo = ({ user, onLogout, onDelete }: AccountInfoProps) => {
  if (!user) {
    return (
      <div className="account-info">
        <div className="error">User data not available</div>
      </div>
    )
  }

  const getInitial = () => {
    if (!user.username || user.username.length === 0) {
      return 'U'
    }
    return user.username.charAt(0).toUpperCase()
  }

  return (
    <div className="account-info">
      <div className="info-header">
        <div className="profile-image">
          <div className="avatar">{getInitial()}</div>
        </div>
        
        <div className="user-details">
          <h2 className="username">{user.username || 'Unknown User'}</h2>
          <div className="user-meta">
            <span className="meta-item">
              <strong>ID:</strong> {user.id || 'N/A'}
            </span>
            <span className="meta-item">
              <strong>Role:</strong> {user.role || 'user'}
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
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Snippets Created</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Comments Made</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Likes Received</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">Days Active</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInfo