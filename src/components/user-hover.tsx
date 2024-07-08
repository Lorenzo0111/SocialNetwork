import type { User } from "@prisma/client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";

export default function UserHover({
  user,
}: {
  user: {
    id: User["id"];
    name: User["name"];
    image: User["image"];
  };
}) {
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

          <h4 className="text-sm font-semibold">{user.name}</h4>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
