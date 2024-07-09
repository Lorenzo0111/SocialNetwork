import type { User } from "@prisma/client";

export type PublicUser = {
  id: User["id"];
  name: User["name"];
  image: User["image"];
  bio: User["bio"];
  followers: number;
  following: number;
};
