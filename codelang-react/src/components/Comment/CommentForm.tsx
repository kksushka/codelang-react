import { useState } from 'react';
import { api } from '../../api/api';
import socket from '../../socket';
import type { CommentDto } from '../../types/comment';
import './CommentForm.scss';

interface Props {
  snippetId: number;
}

const CommentForm = ({ snippetId }: Props) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await api.post('/comments', {
        content: text,
        snippetId,
      });

      const comment: CommentDto = res.data.data ?? res.data;
      socket.emit('newComment', comment);
      setText('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={submit}>
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" disabled={!text.trim() || loading}>
          Send
        </button>
    </form>
  );
};

export default CommentForm;
