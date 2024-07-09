"use client";

import { useState } from "react";
import type { PublicUser } from "~/lib/types";
import { api } from "~/trpc/react";
import { useToast } from "../ui/use-toast";
import { UpdateAvatar } from "./update-avatar";

export function UpdateProfile({
  user,
  readOnly,
}: {
  user: PublicUser;
  readOnly?: boolean;
}) {
  const { toast } = useToast();
  const utils = api.useUtils();
  const [name, setName] = useState<string>(user.name ?? "");
  const [bio, setBio] = useState<string>(user.bio ?? "");
  const updateUser = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
    },
  });

  const handleSubmit = () => {
    if (readOnly) return;

    updateUser.mutate({ name, bio });
    toast({
      description: "Profile updated successfully",
    });
  };

  return (
    <>
      <UpdateAvatar userId={user.id} readOnly={readOnly} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={readOnly}
          placeholder="Name"
          className="font-bold"
        />

        <textarea
          className="resize-none"
          readOnly={readOnly}
          placeholder="Biography"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </form>
    </>
  );
}
