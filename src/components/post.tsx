"use client";

import type { Post, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Trash } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import UserHover from "~/components/user-hover";
import { api } from "~/trpc/react";

export function Post({
  post,
  author,
}: {
  post: Post;
  author: {
    id: User["id"];
    name: User["name"];
    image: User["image"];
  };
}) {
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const { data: me } = api.user.me.useQuery();

  return (
    <Card className="w-2/5">
      <CardHeader className="flex flex-row items-center gap-3">
        <UserHover user={author} />

        <small className="ml-auto">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </small>
      </CardHeader>
      <CardContent className="relative">
        {post.content && <p>{post.content}</p>}
        {post.attachment && (
          <Image
            src={post.attachment}
            alt="Attachment"
            width={500}
            height={500}
          />
        )}
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
