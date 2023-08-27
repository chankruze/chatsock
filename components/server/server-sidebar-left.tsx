/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 02:45:47 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldCheck, Verified, Video } from 'lucide-react';
import { redirect } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

import { ServerChannel } from './server-channel';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VOICE]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

export const roleIconMap = {
  [MemberRole.MEMBER]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Verified className="ml-2 h-4 w-4 text-red-500" />,
};

export const ServerSidebarLeft = async ({ serverId }: ServerSidebarProps) => {
  // fetch the current user's profile
  const profile = await currentProfile();

  // if user is not logged in then redirect to home
  if (!profile) {
    return redirect('/');
  }

  // fetch the server with channels and members data
  const server = await prisma.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

  // if server doesn't exist or user is not a member of the server then redirect to home
  if (!server) {
    return redirect('/');
  }

  // filter the channels by type (Text, Voice, Video)
  // text channels with type 'TEXT'
  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  // voice channels with type 'VOICE'
  const voiceChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VOICE
  );
  // video channels with type 'VIDEO'
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // general members with role 'MEMBER'
  const members = server.members.filter((member) => member.role === 'MEMBER');

  // find the current user's role in the server
  const thisMemberRole = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <aside className="flex h-full w-full flex-col bg-server-sidebar text-primary">
      {/* server header */}
      <ServerHeader server={server} role={thisMemberRole} />
      {/* channels & members */}
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          {/* search */}
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: voiceChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />

        {/* text channels */}
        {textChannels.length ? (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={thisMemberRole}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={thisMemberRole}
                  server={server}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* voice channels */}
        {voiceChannels.length > 0 ? (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VOICE}
              role={thisMemberRole}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {voiceChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={thisMemberRole}
                  server={server}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* video channels */}
        {videoChannels.length > 0 ? (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={thisMemberRole}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={thisMemberRole}
                  server={server}
                />
              ))}
            </div>
          </div>
        ) : null}
      </ScrollArea>
    </aside>
  );
};
