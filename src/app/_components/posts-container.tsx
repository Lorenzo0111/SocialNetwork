"use client";

import { api } from "~/trpc/react";
import { Post } from "./post";

export function PostsContainer() {
  const [posts] = api.post.list.useSuspenseQuery();

  return (
    <div
      className="flex w-full flex-col items-center gap-3 p-4"
      style={{
        minHeight: "calc(100vh - 68px)",
      }}
    >
      {posts.map((post) => (
        <Post key={post.id} author={post.createdBy} post={post} />
      ))}
    </div>
  );
}
