import { notFound } from "next/navigation";
import { Card, CardHeader } from "~/components/ui/card";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { PostsContainer } from "~/components/posts-container";
import UpdateAvatar from "~/components/update-avatar";

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
      <Card className="mx-auto w-2/5">
        <CardHeader className="flex flex-row items-center gap-3">
          <UpdateAvatar
            userId={user.id}
            readOnly={session?.user.id !== user.id}
          />

          <h1>{user.name}</h1>
        </CardHeader>
      </Card>

      <PostsContainer />
    </div>
  );
}
