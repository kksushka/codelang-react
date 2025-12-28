export interface CommentDto {
  id: number;
  content: string;
  snippetId: number;
  user: {
    id: number;
    username: string;
  };
}
