/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 13:08:32 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';

import { prisma } from '@/lib/db';

export const currentProfile = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

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
