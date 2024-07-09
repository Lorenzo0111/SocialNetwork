"use client";

import { api } from "~/trpc/react";
import { Post } from "./post";
import type { Post as PostType } from "@prisma/client";

export function PostsContainer({
  userId,
  setReply,
}: {
  userId?: string;
  setReply?: (post: PostType) => void;
}) {
  const [posts] = api.post.list.useSuspenseQuery(userId);

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      {posts
        .filter((post) => !post.parentId)
        .map((post) => (
          <Post
            key={post.id}
            author={post.createdBy}
            post={post}
            posts={posts}
            reply={(p) => setReply?.(p)}
          />
        ))}
    </div>
  );
}
