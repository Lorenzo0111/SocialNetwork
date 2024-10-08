"use client";

import type { Story as StoryType } from "@prisma/client";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { PublicUser } from "~/lib/types";
import { api } from "~/trpc/react";
import { UserHover } from "../profile/user-hover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Story({
  author,
  story,
}: {
  story: StoryType;
  author: PublicUser;
}) {
  const utils = api.useUtils();
  const deleteStory = api.story.delete.useMutation({
    onSuccess: async () => {
      await utils.story.invalidate();
      setOpen(false);
    },
  });
  const { data: me } = api.user.me.get.useQuery();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Avatar onClick={() => setOpen(true)}>
        <AvatarImage
          src={author.image ?? undefined}
          alt={author.name ?? "Avatar"}
        />
        <AvatarFallback>{author.name}</AvatarFallback>
      </Avatar>

      {open &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            className="absolute left-0 top-0 flex h-screen w-screen flex-col items-center justify-center bg-black/50"
          >
            <div className="relative h-3/4 w-1/3">
              <UserHover
                user={author}
                className="absolute left-4 top-4 text-white"
              />

              <Image
                src={story.attachment}
                alt="Attachment"
                width={500}
                height={500}
                className="h-full w-full rounded-xl object-cover"
                objectFit="cover"
              />

              {me?.id === author.id && (
                <button
                  onClick={() => {
                    deleteStory.mutate({ id: story.id });
                  }}
                  className="absolute bottom-3 right-3"
                >
                  <Trash color="white" />
                </button>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
