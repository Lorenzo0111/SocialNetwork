"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { UploadButton } from "~/components/uploadthing";
import { api } from "~/trpc/react";

export default function UpdateAvatar({
  userId,
  readOnly,
}: {
  userId: string;
  readOnly?: boolean;
}) {
  const utils = api.useUtils();
  const [user] = api.user.get.useSuspenseQuery({ id: userId });
  const updateUser = api.user.update.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
    },
  });

  if (!user) return null;

  return (
    <UploadButton
      className="ut-button:h-14 ut-button:w-14 ut-button:bg-transparent ut-allowed-content:hidden"
      content={{
        button: (
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Avatar"}
            />
            <AvatarFallback>{user.name}</AvatarFallback>
          </Avatar>
        ),
      }}
      disabled={readOnly}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        updateUser.mutate({ image: res[0]?.url });
      }}
    />
  );
}
