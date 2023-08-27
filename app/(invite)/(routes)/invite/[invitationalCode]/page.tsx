/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 15:45:03 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

interface InviteCodePageProps {
  params: {
    invitationalCode: string;
  };
}

export default async function InvitationalPage({
  params,
}: InviteCodePageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.invitationalCode) {
    return redirect('/');
  }

  // check if the user is already a member of the server
  const existingServer = await prisma.server.findFirst({
    where: {
      inviteCode: params.invitationalCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // if the user is already a member of the server redirect to that server
  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  // if the user is not a member of the server add the user to the server
  const server = await prisma.server.update({
    where: {
      inviteCode: params.invitationalCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  // after adding the user to the server redirect to that server
  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}
