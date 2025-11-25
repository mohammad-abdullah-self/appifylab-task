"use client";

import { CommentsType } from "@/types/commentType";
import { FC, useTransition } from "react";
import CommentReplyForm from "@/app/ui/feed/comment-reply-form";
import { PostType } from "@/types/postType";
import CommentReply from "@/app/ui/feed/comment-reply";
import { toggleLikeAction } from "@/actions/post";

interface Props {
  comment: CommentsType;
  post: PostType;
}

const Comment: FC<Props> = ({ comment, post }) => {
  const [isPending, startTransition] = useTransition();

  const handleLike = (postId: number) => {
    startTransition(async () => {
      try {
        await toggleLikeAction("comment", postId);
      } catch (err) {
        console.error(err);
      }
    });
  };
  return (
    <>
      <div className="_comment_main mb-4">
        <div className="_comment_image">
          <a href="profile.html" className="_comment_image_link">
            <img
              src="assets/images/txt_img.png"
              alt=""
              className="_comment_img1"
            />
          </a>
        </div>
        <div className="_comment_area">
          <div className="_comment_details">
            <div className="_comment_details_top">
              <div className="_comment_name">
                <a href="profile.html ">
                  <h4 className="_comment_name_title">{`${comment.author.firstName} ${comment.author.lastName}`}</h4>
                </a>
              </div>
            </div>
            <div className="_comment_status">
              <p className="_comment_status_text">
                <span>{comment.content}</span>
              </p>
            </div>
            <div
              className="_total_reactions"
              title={comment.likesNames.join("\n")}
            >
              <div className="_total_react gap-2">
                <span className="_total">{comment.likeCount}</span>
                <span className="_reaction_like">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-thumbs-up"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  </svg>
                </span>{" "}
                <span className="_reaction_heart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-heart"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
              </div>
              <span className="_total">0</span>
            </div>
            <div className="_comment_reply">
              <div className="_comment_reply_num">
                <ul className="_comment_reply_list">
                  <li
                    onClick={() => !isPending && handleLike(Number(comment.id))}
                  >
                    <span>Like.</span>
                  </li>
                  <li>
                    <span>Reply.</span>
                  </li>
                  <li>
                    <span>Share</span>
                  </li>
                  <li>
                    <span className="_time_link">.21m</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <CommentReplyForm comment={comment} post={post} />
          <div>
            {comment?.replies?.length > 0 && (
              <>
                {comment.replies.map((reply) => (
                  <CommentReply key={reply.id} reply={reply} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Comment;
