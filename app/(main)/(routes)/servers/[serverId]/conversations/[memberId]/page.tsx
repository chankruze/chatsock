/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 07:30:58 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

interface DirectMessageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function DirectMessage({
  params,
  searchParams,
}: DirectMessageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect('/');
  }

  return (
    <div className="bg-conversation flex h-full flex-col">
      {currentMember.profile.name}
    </div>
  );
}
