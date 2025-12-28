import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Snippet } from '../../types/snippet';
import type { CommentDto } from '../../types/comment';
import { api } from '../../api/api';
import socket from '../../socket';
import { useAuth } from '../../hooks/useAuth';
import { normalizeSnippet } from '../../utils/normalizeSnippet';
import CommentForm from '../../components/Comment/CommentForm';
import CommentList from '../../components/Comment/CommentList';
import './SnippetPage.scss';

const SnippetPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadSnippet = async () => {
      try {
        const res = await api.get(`/snippets/${id}`);
        const data = res.data.data ?? res.data;

        const normalizedSnippet = normalizeSnippet(data, user?.id);
        
        setSnippet(normalizedSnippet);
        setComments(data.comments ?? []);
      } catch (e) {
        console.error('Failed to load snippet', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSnippet();
  }, [id, user?.id]);

  useEffect(() => {
    const handleNewComment = (comment: CommentDto) => {
      if (comment.snippetId === Number(id)) {
        setComments(prev => [comment, ...prev]);
      }
    };

    socket.on('newComment', handleNewComment);

    return () => {
      socket.off('newComment', handleNewComment);
    };
  }, [id]);

  useEffect(() => {
    const handleNewMark = (data: {
      snippetId: number;
      mark: 'like' | 'dislike';
      userId: number;
    }) => {
      if (data.snippetId !== Number(id)) return;

      setSnippet(prev => {
        if (!prev) return prev;

        const marks = [...prev.marks];
        const existingMarkIndex = marks.findIndex(
          mark => mark.user.id === data.userId
        );

        if (existingMarkIndex !== -1) {
          const existingMark = marks[existingMarkIndex];
          
          if (existingMark.type === data.mark) {
            marks.splice(existingMarkIndex, 1);
          } else {
            marks[existingMarkIndex] = {
              ...existingMark,
              type: data.mark
            };
          }
        } else {
          marks.push({
            id: Date.now(),
            type: data.mark,
            user: {
              id: data.userId,
              username: 'User'
            }
          });
        }

        const likesCount = marks.filter(mark => mark.type === 'like').length;
        const dislikesCount = marks.filter(mark => mark.type === 'dislike').length;
        const myMark = marks.find(mark => mark.user.id === user?.id)?.type;

        return {
          ...prev,
          marks,
          likesCount,
          dislikesCount,
          myMark
        };
      });
    };

    socket.on('newMark', handleNewMark);

    return () => {
      socket.off('newMark', handleNewMark);
    };
  }, [id, user?.id]);

  const handleVote = async (mark: 'like' | 'dislike') => {
    if (!snippet || !user || voteLoading) return;

    setVoteLoading(true);

    try {
      await api.post(`/snippets/${snippet.id}/mark`, { mark });

      const marks = [...snippet.marks];
      const existingMarkIndex = marks.findIndex(
        m => m.user.id === user.id
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
            id: user.id,
            username: user.username
          }
        });
      }

      const likesCount = marks.filter(m => m.type === 'like').length;
      const dislikesCount = marks.filter(m => m.type === 'dislike').length;
      const myMark = marks.find(m => m.user.id === user.id)?.type;

      const updatedSnippet: Snippet = {
        ...snippet,
        marks,
        likesCount,
        dislikesCount,
        myMark
      };

      setSnippet(updatedSnippet);

      socket.emit('newMark', {
        snippetId: snippet.id,
        mark,
        userId: user.id
      });

    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setVoteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading snippet...</p>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="error">
        <h3>Snippet not found</h3>
        <p>The snippet you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="snippet-page">
      <div className="snippet-detail">
        <div className="snippet-header">
          <div className="user-info">
            <b>{snippet.user.username}</b>
          </div>
          <span className="language-badge">{snippet.language}</span>
        </div>
        
        <div className="code-block">
          <pre><code>{snippet.code}</code></pre>
        </div>
        
        <div className="snippet-stats">
          <div className="reactions">
            <button
              className={`reaction-btn like ${snippet.myMark === 'like' ? 'active' : ''}`}
              onClick={() => handleVote('like')}
              disabled={!user || voteLoading}
              title={user ? 'Like' : 'Login to like'}
            >
              👍 {snippet.likesCount}
            </button>
            
            <button
              className={`reaction-btn dislike ${snippet.myMark === 'dislike' ? 'active' : ''}`}
              onClick={() => handleVote('dislike')}
              disabled={!user || voteLoading}
              title={user ? 'Dislike' : 'Login to dislike'}
            >
              👎 {snippet.dislikesCount}
            </button>
            
            <div className="comments-count">
              💬 {comments.length}
            </div>
          </div>
        </div>
      </div>

      {user ? (
        <CommentForm snippetId={snippet.id} />
      ) : (
        <div className="login-prompt">
          <p>Please <a href="/login">login</a> to leave a comment</p>
        </div>
      )}

      <CommentList comments={comments} />
    </div>
  );
};

export default SnippetPage;