"use client";

import { api } from "~/trpc/react";
import { Button } from "../ui/button";

export function FollowButton({ userId }: { userId: string }) {
  const utils = api.useUtils();
  const [following] = api.user.me.following.useSuspenseQuery();
  const follow = api.user.follow.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
    },
  });
  const unfollow = api.user.unfollow.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
    },
  });

  const classNames = "absolute top-3 right-3";

  if (following.includes(userId))
    return (
      <Button
        className={classNames}
        onClick={() => unfollow.mutate(userId)}
        variant="secondary"
      >
        Unfollow
      </Button>
    );

  return (
    <Button className={classNames} onClick={() => follow.mutate(userId)}>
      Follow
    </Button>
  );
}
