import CommentItem from './CommentItem'
import type { Comment } from '../types/comment'

interface Props {
  comments: Comment[]
}

const CommentList = ({ comments }: Props) => {
  return (
    <div className="comments">
      <h3>Comments ({comments.length})</h3>

      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}

export default CommentList
