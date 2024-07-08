import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { CreatePost } from "~/components/create-post";
import { PostsContainer } from "~/components/posts-container";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <PostsContainer />
      {session?.user && <CreatePost />}
    </HydrateClient>
  );
}
