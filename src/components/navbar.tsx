import { getServerAuthSession } from "~/server/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Button } from "./ui/button";

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <nav className="flex h-14 items-center justify-between border-b p-4">
      <Link href="/" className="font-extrabold">
        Social
      </Link>
      {session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={session.user.image ?? undefined}
                alt={session.user.name ?? "Avatar"}
              />
              <AvatarFallback>{session.user.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Welcome {session.user.name}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/${session.user.id}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signout">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!session?.user && (
        <Button asChild>
          <Link href="/api/auth/signin">Login</Link>
        </Button>
      )}
    </nav>
  );
}
