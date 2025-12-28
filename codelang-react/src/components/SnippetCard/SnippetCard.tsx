import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import socket from '../../socket';
import type { Snippet } from '../../types/snippet';
import './SnippetCard.scss';

type Props = {
  snippet: Snippet;
  currentUserId?: number;
  onUpdate?: (updatedSnippet: Snippet) => void;
}

const SnippetCard = ({ snippet, currentUserId, onUpdate }: Props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openSnippet = () => {
    navigate(`/snippets/${snippet.id}`);
  };

  const vote = async (mark: 'like' | 'dislike') => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await api.post(`/snippets/${snippet.id}/mark`, { mark });

      const marks = [...snippet.marks];
      const existingMarkIndex = marks.findIndex(
        m => m.user.id === currentUserId
      );

      if (existingMarkIndex !== -1) {
        const existingMark = marks[existingMarkIndex];
        
        if (existingMark.type === mark) {
          marks.splice(existingMarkIndex, 1);
        } else {
          marks[existingMarkIndex] = {
            ...existingMark,
            type: mark
          };
        }
      } else {
        marks.push({
          id: Date.now(), 
          type: mark,
          user: {
            id: currentUserId,
            username: 'You' 
          }
        });
      }

      const likesCount = marks.filter(m => m.type === 'like').length;
      const dislikesCount = marks.filter(m => m.type === 'dislike').length;
      const myMark = marks.find(m => m.user.id === currentUserId)?.type;

      const updatedSnippet: Snippet = {
        ...snippet,
        marks,
        likesCount,
        dislikesCount,
        myMark
      };

      if (onUpdate) {
        onUpdate(updatedSnippet);
      }

      socket.emit('newMark', {
        snippetId: snippet.id,
        mark,
        userId: currentUserId
      });

    } catch (err: any) {
      console.error('Vote error:', err);
      setError(err.response?.data?.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    vote('like');
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.stopPropagation();
    vote('dislike');
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openSnippet();
  };

  return (
    <div className="snippet-card" onClick={openSnippet}>
      <div className="snippet-header">
        <b>{snippet.user.username}</b>
        <span className="lang">{snippet.language}</span>
      </div>

      <pre className="snippet-code">{snippet.code}</pre>

      <div className="snippet-actions">
        <div className="left">
          <button 
            className={`like-btn ${snippet.myMark === 'like' ? 'active' : ''}`}
            onClick={handleLike}
            disabled={loading}
            title={currentUserId ? 'Like' : 'Login to like'}
          >
            👍 {snippet.likesCount}
          </button>
          
          <button 
            className={`dislike-btn ${snippet.myMark === 'dislike' ? 'active' : ''}`}
            onClick={handleDislike}
            disabled={loading}
            title={currentUserId ? 'Dislike' : 'Login to dislike'}
          >
            👎 {snippet.dislikesCount}
          </button>
        </div>

        <div
          className="right"
          onClick={handleCommentsClick}
          title="View comments"
        >
          💬 {snippet.comments?.length || 0}
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default SnippetCard;