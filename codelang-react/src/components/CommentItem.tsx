import type { Comment } from '../types/comment'

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="comment">
      <b>{comment.user.username}</b>
      <p>{comment.content}</p>
    </div>
  )
}

export default CommentItem
