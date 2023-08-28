/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 07:30:58 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/chat-header';
import { getOrCreateConversation } from '@/lib/conversation';
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
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  console.log(conversation)

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { participantOne, participantTwo } = conversation;

  const otherMember =
    participantOne.profileId === profile.id ? participantTwo : participantOne;

  return (
    <div className="bg-conversation flex h-full flex-col">
      <ChatHeader
        imageUrl={otherMember.profile.avatar}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
}
