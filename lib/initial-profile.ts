/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 08:06:53 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { prisma } from '@/lib/db';
import { currentUser, redirectToSignIn } from '@clerk/nextjs';

export async function initialProfile() {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!profile) {
    return await prisma.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.emailAddresses[0].emailAddress,
        avatar: user.imageUrl,
        bio: `Hey there! I am using ${process.env.NEXT_PUBLIC_APP_NAME}`,
      },
    });
  }

  return profile;
}
