"use client";

import { api } from "~/trpc/react";
import { Story } from "./story";

export function StoriesContainer() {
  const [stories] = api.story.list.useSuspenseQuery();

  return (
    <div className="flex w-full items-center gap-3 p-4">
      {stories.map((story) => (
        <Story key={story.id} story={story} author={story.createdBy} />
      ))}
    </div>
  );
}
