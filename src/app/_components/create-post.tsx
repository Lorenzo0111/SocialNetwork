"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export function CreatePost() {
  const utils = api.useUtils();
  const [content, setContent] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setContent("");
    },
  });

  return (
    <div className="fixed bottom-3 w-screen flex justify-center items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ content });
        }}
        className="mt-auto flex w-2/5 gap-2"
      >
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
