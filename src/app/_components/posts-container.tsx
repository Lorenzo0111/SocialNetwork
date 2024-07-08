"use client";

import { api } from "~/trpc/react";
import { Post } from "./post";

export function PostsContainer({ userId }: { userId?: string }) {
  const [posts] = api.post.list.useSuspenseQuery(userId);

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      {posts.map((post) => (
        <Post key={post.id} author={post.createdBy} post={post} />
      ))}
    </div>
  );
}
