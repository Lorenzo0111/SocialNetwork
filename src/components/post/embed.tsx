"use client";

import Image from "next/image";
import { api } from "~/trpc/react";

export default function Embed({ url }: { url: string }) {
  const [embed] = api.post.embed.useSuspenseQuery(url);
  if (!embed) return null;

  return (
    <div
      className="flex w-full justify-between border-l-2 pl-2"
      style={{
        borderLeftColor: embed.color,
      }}
    >
      <div>
        <h3 className="text-lg font-bold">{embed.title}</h3>
        <p>{embed.description}</p>
      </div>
      {embed.image && (
        <Image src={embed.image} alt={"Embed image"} width={60} height={60} />
      )}
    </div>
  );
}
