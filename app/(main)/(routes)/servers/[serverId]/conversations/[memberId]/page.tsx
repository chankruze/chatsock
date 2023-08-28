/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 07:30:58 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-message';
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

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { participantOne, participantTwo } = conversation;

  const otherMember =
    participantOne.profileId === profile.id ? participantTwo : participantOne;

  return (
    <div className="flex h-full flex-col bg-conversation">
      <ChatHeader
        imageUrl={otherMember.profile.avatar}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
      />
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/dms"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/dms"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/dms"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}
