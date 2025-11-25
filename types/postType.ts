import { CommentsType } from "./commentType";
import { AuthorType } from "./userType";

export type PostType = {
  id: number;
  content: string;
  imageUrl: string;
  isPrivate: boolean;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  likesNames: string[];
  author: AuthorType;
  comments: CommentsType[];
};
