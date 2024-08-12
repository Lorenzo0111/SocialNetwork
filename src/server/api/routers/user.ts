import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          AND: [
            {
              id: input.id,
            },
            {
              OR: [
                {
                  followers: { some: { followerId: ctx.session?.user.id } },
                },
                {
                  id: ctx.session?.user.id,
                },
                {
                  private: false,
                },
              ],
            },
          ],
        },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!user) return null;

      return {
        ...user,
        followers: user._count.followers,
        following: user._count.following,
      };
    }),

  me: createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
          _count: {
            select: {
              followers: true,
              following: true,
            },
          },
        },
      });

      if (!user) return null;

      return {
        ...user,
        followers: user._count.followers,
        following: user._count.following,
      };
    }),

    followers: protectedProcedure.query(async ({ ctx }) => {
      return (
        await ctx.db.user.findMany({
          where: {
            following: { some: { followingId: ctx.session.user.id } },
          },
          select: {
            id: true,
          },
        })
      ).map((user) => user.id);
    }),

    following: protectedProcedure.query(async ({ ctx }) => {
      return (
        await ctx.db.user.findMany({
          where: {
            followers: { some: { followerId: ctx.session.user.id } },
          },
          select: {
            id: true,
          },
        })
      ).map((user) => user.id);
    }),
  }),

  update: protectedProcedure
    .input(
      z.object({
        image: z.string().optional(),
        name: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },

        data: {
          image: input.image,
          name: input.name,
          bio: input.bio,
        },
      });
    }),

  follow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.follows.create({
        data: {
          followerId: ctx.session.user.id,
          followingId: input,
        },
      });
    }),

  unfollow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.follows.deleteMany({
        where: {
          followerId: ctx.session.user.id,
          followingId: input,
        },
      });
    }),
});
