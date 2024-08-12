"use client";

import { api } from "~/trpc/react";
import { CreateStory } from "./create-story";
import { Story } from "./story";

export function StoriesContainer() {
  const [stories] = api.story.list.useSuspenseQuery();

  return (
    <div className="mx-auto flex items-center gap-3 p-4">
      <CreateStory />

      {stories.map((story) => (
        <Story key={story.id} story={story} author={story.createdBy} />
      ))}
    </div>
  );
}
