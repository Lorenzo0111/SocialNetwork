"use client";

import type { Post as PostType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Reply, Trash } from "lucide-react";
import Image from "next/image";
import { UserHover } from "~/components/profile/user-hover";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { PublicUser } from "~/lib/types";
import { api } from "~/trpc/react";
import { PostReply } from "./post-reply";

export function Post({
  posts,
  post,
  author,
  reply,
}: {
  posts: (PostType & {
    createdBy: PublicUser;
  })[];
  post: PostType;
  author: PublicUser;
  reply: (post: PostType) => void;
}) {
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const { data: me } = api.user.me.get.useQuery();

  return (
    <Card className="lg:w-2/5">
      <CardHeader className="flex flex-row items-center gap-3">
        <UserHover user={author} />

        <small className="ml-auto">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </small>
      </CardHeader>
      <CardContent className="relative pb-10">
        {post.content && <p>{post.content}</p>}
        {post.attachment && (
          <Image
            src={post.attachment}
            alt="Attachment"
            width={500}
            height={500}
          />
        )}

        <PostReply
          posts={posts}
          replies={posts.filter((p) => p.parentId === post.id)}
          reply={reply}
        />

        <button
          onClick={() => reply(post)}
          className="absolute bottom-3 left-3"
        >
          <Reply />
        </button>

        {me?.id === author.id && (
          <button
            onClick={() => {
              deletePost.mutate({ id: post.id });
            }}
            className="absolute bottom-3 right-3"
          >
            <Trash />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
