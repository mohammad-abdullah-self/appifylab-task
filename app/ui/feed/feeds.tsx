"use client";

import { PostType } from "@/types/postType";
import { FC } from "react";
import Feed from "./feed";

interface Props {
  posts: PostType[];
}

const Feeds: FC<Props> = ({ posts }) => {
  return (
    <>
      {posts.map((post) => (
        <Feed key={post.id} post={post} />
      ))}
    </>
  );
};

export default Feeds;
