"use client";

import type { Post } from "@prisma/client";
import { useState } from "react";
import { CreatePost } from "../post/create-post";
import { PostsContainer } from "../post/posts-container";

export function HomePage({ loggedIn }: { loggedIn?: boolean }) {
  const [reply, setReply] = useState<Post | null>(null);

  return (
    <>
      <PostsContainer setReply={setReply} />
      {loggedIn && <CreatePost reply={reply} setReply={setReply} />}
    </>
  );
}
