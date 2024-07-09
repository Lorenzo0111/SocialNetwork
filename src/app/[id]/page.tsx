import { notFound } from "next/navigation";
import { Card, CardHeader } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PostsContainer } from "~/components/post/posts-container";
import { UpdateProfile } from "~/components/profile/update-profile";
import { Button } from "~/components/ui/button";
import { FollowButton } from "~/components/profile/follow-button";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await api.user.get({ id });
  if (!user) return notFound();

  const session = await getServerAuthSession();

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      <Card className="mx-auto w-11/12 lg:w-2/5">
        <CardHeader className="relative flex flex-row items-center gap-3">
          <UpdateProfile user={user} readOnly={session?.user.id !== user.id} />
          <FollowButton userId={user.id} />
        </CardHeader>
      </Card>

      <PostsContainer />
    </div>
  );
}
