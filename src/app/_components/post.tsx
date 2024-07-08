"use client";

import type { Post, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

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
  return (
    <Card className="w-2/5">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage
            src={author.image ?? undefined}
            alt={author.name ?? "Avatar"}
          />
          <AvatarFallback>{author.name}</AvatarFallback>
        </Avatar>

        <h2>{author.name}</h2>

        <small className="ml-auto">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </small>
      </CardHeader>
      <CardContent>{post.content}</CardContent>
    </Card>
  );
}
