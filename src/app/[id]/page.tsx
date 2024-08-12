import { notFound } from "next/navigation";
import { PrivateProfile } from "~/components/pages/PrivateProfile";
import { PostsContainer } from "~/components/post/posts-container";
import { FollowButton } from "~/components/profile/follow-button";
import { UpdateProfile } from "~/components/profile/update-profile";
import { Card, CardHeader } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await api.user.get({ id });
  if (!user) return <PrivateProfile />;

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
