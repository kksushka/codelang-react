import type { CommentDto } from '../../types/comment';
import './CommentItem.scss';

const CommentItem = ({ comment }: { comment: CommentDto }) => (
  <div className="comment-item">
    <div className="avatar">
      {comment.user.username[0].toUpperCase()}
    </div>

    <div className="body">
      <b>{comment.user.username}</b>
      <p>{comment.content}</p>
    </div>
  </div>
);

export default CommentItem;
