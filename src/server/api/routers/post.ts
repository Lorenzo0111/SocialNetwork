import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z
        .object({
          content: z.string().min(1).optional(),
          attachment: z.string().optional(),
          reply: z.number().optional(),
        })
        .refine((input) => {
          if (!input.content && !input.attachment) {
            throw new Error("Content or attachment is required");
          }
          return true;
        }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          content: input.content,
          attachment: input.attachment,
          createdBy: { connect: { id: ctx.session.user.id } },
          parent: input.reply ? { connect: { id: input.reply } } : undefined,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.delete({
        where: { id: input.id, createdById: ctx.session.user.id },
      });

      if (post?.attachment) {
        const url = new URL(post.attachment);
        const path = url.pathname.split("/");
        await utapi.deleteFiles(path[path.length - 1]!);
      }

      return post;
    }),

  list: publicProcedure.input(z.string().optional()).query(({ ctx, input }) => {
    return ctx.db.post.findMany({
      where: {
        createdById: input,
        parentId: input ? null : undefined,
      },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
      },
    });
  }),
});
