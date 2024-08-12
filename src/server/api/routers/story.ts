import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { utapi } from "~/server/uploadthing";

export const storyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        attachment: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.story.create({
        data: {
          attachment: input.attachment,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const story = await ctx.db.story.delete({
        where: { id: input.id, createdById: ctx.session.user.id },
      });

      if (!story) return null;

      const url = new URL(story.attachment);
      const path = url.pathname.split("/");
      await utapi.deleteFiles(path[path.length - 1]!);

      return story;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const stories = await ctx.db.story.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                createdBy: {
                  followers: { some: { followerId: ctx.session.user.id } },
                },
              },
              { createdById: ctx.session.user.id },
            ],
          },
          {
            createdAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 24) },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            _count: {
              select: { followers: true, following: true },
            },
          },
        },
      },
    });

    return stories.map((story) => ({
      ...story,
      createdBy: {
        ...story.createdBy,
        followers: story.createdBy._count.followers,
        following: story.createdBy._count.following,
      },
    }));
  }),
});
