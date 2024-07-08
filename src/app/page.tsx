import { api, HydrateClient } from "~/trpc/server";
import { Post } from "./_components/post";
import { CreatePost } from "./_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { PostsContainer } from "./_components/posts-container";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <PostsContainer />
      {session?.user && <CreatePost />}
    </HydrateClient>
  );
}
