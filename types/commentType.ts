import { AuthorType } from "./userType";

export type CommentsType = {
  id: number;
  postId: number;
  parentId: number;
  content: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  likesNames: string[];
  author: AuthorType;
  replies: CommentsType[];
};
