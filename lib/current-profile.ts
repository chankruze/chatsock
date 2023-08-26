/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 12:01:52 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { auth } from '@clerk/nextjs';

import { prisma } from '@/lib/db';

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
