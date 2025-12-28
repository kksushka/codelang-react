import { useEffect, useState } from 'react';
import { api } from '../api/api';
import socket from '../socket';
import SnippetCard from '../components/SnippetCard/SnippetCard';
import type { Snippet } from '../types/snippet';
import { useAuth } from '../hooks/useAuth';
import { normalizeSnippet } from '../utils/normalizeSnippet';

const Home = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const currentUserId = user?.id;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/snippets');
        const responseData = res.data;
        
        const snippetsList = responseData.data?.data || responseData.data || [];
        
        const normalized = snippetsList.map((s: any) =>
          normalizeSnippet(s, currentUserId)
        );

        setSnippets(normalized);
      } catch (error) {
        console.error('Failed to load snippets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const handleNewMark = (data: {
      snippetId: number;
      mark: 'like' | 'dislike';
      userId: number;
    }) => {
      setSnippets(prev =>
        prev.map(snippet => {
          if (snippet.id !== data.snippetId) return snippet;

          const marks = [...snippet.marks];
          
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
          
          const myMark = marks.find(mark => mark.user.id === currentUserId)?.type;

          return {
            ...snippet,
            marks,
            likesCount,
            dislikesCount,
            myMark
          };
        })
      );
    };

    socket.on('newMark', handleNewMark);

    return () => {
      socket.off('newMark', handleNewMark);
    };
  }, [currentUserId]);

  const handleSnippetUpdate = (updatedSnippet: Snippet) => {
    setSnippets(prev =>
      prev.map(snippet =>
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      )
    );
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading snippets...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="welcome">Welcome to Codelang!</h1>

      {snippets.map(snippet => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          currentUserId={currentUserId}
          onUpdate={handleSnippetUpdate}
        />
      ))}
    </>
  );
};

export default Home;