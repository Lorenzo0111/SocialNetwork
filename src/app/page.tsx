import { HomePage } from "~/components/pages/HomePage";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <HomePage loggedIn={!!session} />
    </HydrateClient>
  );
}
