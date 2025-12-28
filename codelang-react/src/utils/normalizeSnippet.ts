import type { Snippet, Mark } from '../types/snippet';

export const normalizeSnippet = (data: any, currentUserId?: number): Snippet => {
  const marks = data.marks || [];
  
  const likes = marks.filter((mark: Mark) => mark.type === 'like');
  const dislikes = marks.filter((mark: Mark) => mark.type === 'dislike');
  
  let myMark: 'like' | 'dislike' | undefined = undefined;
  if (currentUserId) {
    const userMark = marks.find((mark: Mark) => mark.user.id === currentUserId);
    if (userMark) {
      myMark = userMark.type;
    }
  }

  return {
    id: Number(data.id),
    code: data.code,
    language: data.language,
    user: data.user,
    marks: marks.map((mark: any) => ({
      id: mark.id,
      type: mark.type,
      user: mark.user
    })),
    likesCount: likes.length,
    dislikesCount: dislikes.length,
    myMark,
    comments: data.comments || [],
  };
};