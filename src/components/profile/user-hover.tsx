import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import type { PublicUser } from "~/lib/types";

export function UserHover({ user }: { user: PublicUser }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link href={`/${user.id}`} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Avatar"}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>

          <h2>{user.name}</h2>
        </Link>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Avatar"}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>

          <div>
            <h4 className="text-sm font-semibold">{user.name}</h4>
            <p>{user.bio}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
