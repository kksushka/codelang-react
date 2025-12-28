import type { CommentDto } from '../../types/comment';
import CommentItem from './CommentItem';

const CommentList = ({ comments }: { comments: CommentDto[] }) => (
  <div className="comments">
    <h3>Comments ({comments.length})</h3>
    {comments.map(c => (
      <CommentItem key={c.id} comment={c} />
    ))}
  </div>
);

export default CommentList;
