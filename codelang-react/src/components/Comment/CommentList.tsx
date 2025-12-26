import CommentItem from './CommentItem'
import type { Comment } from '../../types/comment'

const CommentList = ({ comments }: { comments: Comment[] }) => {
  return (
    <div className="comments">
      <h3>Comments ({comments.length})</h3>
      {comments.map(c => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  )
}

export default CommentList
