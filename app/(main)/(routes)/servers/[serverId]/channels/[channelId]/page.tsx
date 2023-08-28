/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 07:18:05 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ChatHeader } from '@/components/chat/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await prisma.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div className="bg-channel flex h-full flex-col">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
    </div>
  );
}
