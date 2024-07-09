import type { Post } from "@prisma/client";
import { Reply, Trash } from "lucide-react";
import type { PublicUser } from "~/lib/types";
import { api } from "~/trpc/react";
import { UserHover } from "../profile/user-hover";

export function PostReply({
  posts,
  replies,
  reply,
}: {
  posts: (Post & {
    createdBy: PublicUser;
  })[];
  replies: (Post & {
    createdBy: PublicUser;
  })[];
  reply: (post: Post) => void;
}) {
  const utils = api.useUtils();
  const deletePost = api.post.delete.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
    },
  });

  const { data: me } = api.user.me.useQuery();
  return replies?.map((replyItem) => (
    <div key={replyItem.id} className="my-3 ml-3">
      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-secondary pr-2">
          <UserHover user={replyItem.createdBy} />
        </div>
        <p>» {replyItem.content}</p>

        <button onClick={() => reply(replyItem)} className="ml-auto">
          <Reply />
        </button>

        {me?.id === replyItem.createdBy.id && (
          <button
            onClick={() => {
              deletePost.mutate({ id: replyItem.id });
            }}
          >
            <Trash />
          </button>
        )}
      </div>

      <PostReply
        posts={posts}
        replies={posts.filter((post) => post.parentId === replyItem.id)}
        reply={reply}
      />
    </div>
  ));
}
