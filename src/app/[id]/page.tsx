import { notFound } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardHeader } from "~/components/ui/card";
import { api } from "~/trpc/server";
import { PostsContainer } from "../_components/posts-container";

export default async function Profile({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await api.user.get({ id });
  if (!user) return notFound();

  return (
    <div className="flex w-full flex-col items-center gap-3 p-4">
      <Card className="mx-auto w-2/5">
        <CardHeader className="flex flex-row items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Avatar"}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
          <h1>{user.name}</h1>
        </CardHeader>
      </Card>

      <PostsContainer />
    </div>
  );
}
