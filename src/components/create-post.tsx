"use client";

import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { UploadButton } from "~/components/uploadthing";
import { api } from "~/trpc/react";

export function CreatePost() {
  const utils = api.useUtils();
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setContent("");
      setAttachment("");
    },
  });

  return (
    <div className="fixed bottom-3 flex w-screen flex-col items-center justify-center">
      {attachment && (
        <div className="m-4 flex w-2/5 items-center gap-2 rounded-xl border p-4">
          <Image
            src={attachment}
            alt="Uploaded Attachment"
            width={100}
            height={100}
            className="rounded-xl"
          />
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ attachment, content });
        }}
        className="mt-auto flex w-2/5 gap-2"
      >
        <UploadButton
          className="ut-button:h-10 ut-button:w-10 ut-button:bg-transparent ut-allowed-content:hidden"
          content={{
            button: <ImageIcon color="black" />,
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            setAttachment(res[0]?.url ?? "");
          }}
        />

        <Input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" disabled={createPost.isPending}>
          {createPost.isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
