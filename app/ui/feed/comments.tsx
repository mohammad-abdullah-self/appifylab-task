"use client";

import { FC } from "react";
import Comment from "./comment";
import { PostType } from "@/types/postType";
import { CommentsType } from "@/types/commentType";

interface Props {
  comments: CommentsType[];
  post: PostType;
}

const Comments: FC<Props> = ({ comments,post }) => {
  return (
    <>
      <div className="_timline_comment_main">
        {/* <div className="_previous_comment">
          <button type="button" className="_previous_comment_txt">
            View 4 previous comments
          </button>
        </div> */}

        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} post={post} />
        ))}
      </div>
    </>
  );
};

export default Comments;
