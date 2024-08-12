"use client";

import { Image as ImageIcon } from "lucide-react";
import { UploadButton } from "~/components/uploadthing";
import { api } from "~/trpc/react";

export function CreateStory() {
  const utils = api.useUtils();
  const createPost = api.story.create.useMutation({
    onSuccess: async () => {
      await utils.story.invalidate();
    },
  });

  return (
    <UploadButton
      className="ut-button:h-10 ut-button:w-10 ut-button:rounded-full ut-button:border ut-button:bg-transparent ut-allowed-content:hidden"
      content={{
        button: <ImageIcon color="black" />,
      }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        createPost.mutate({ attachment: res[0]!.url });
      }}
      disabled={createPost.isPending}
    />
  );
}
