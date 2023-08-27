/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 08:26:58 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirect } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

import { ServerMember } from './server-member';
import { ServerSection } from './server-section';

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebarRight = async ({ serverId }: ServerSidebarProps) => {
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
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  // if server doesn't exist or user is not a member of the server then redirect to home
  if (!server) {
    return redirect('/');
  }

  // filter the members by role (Admin, Moderator, Member)
  // admins with role 'ADMIN'
  const admins = server.members.filter((member) => member.role === 'ADMIN');
  // moderators with role 'MODERATOR'
  const moderators = server.members.filter(
    (member) => member.role === 'MODERATOR'
  );
  // general members with role 'MEMBER'
  const members = server.members.filter((member) => member.role === 'MEMBER');

  // find the current user's role in the server
  const thisMemberRole = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <aside className="flex h-full w-full flex-col bg-server-sidebar py-2 text-primary">
      {/* channels & members */}
      <ScrollArea className="flex-1 px-3">
        {/* admins */}
        {admins.length > 0 ? (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={thisMemberRole}
              label="Admins"
              count={admins.length}
              server={server}
            />
            <div className="space-y-[2px]">
              {admins.map((admin) => (
                <ServerMember key={admin.id} member={admin} server={server} />
              ))}
            </div>
          </div>
        ) : null}

        {/* moderators */}
        {moderators.length > 0 ? (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={thisMemberRole}
              label="Moderators"
              count={moderators.length}
              server={server}
            />
            <div className="space-y-[2px]">
              {moderators.map((moderator) => (
                <ServerMember
                  key={moderator.id}
                  member={moderator}
                  server={server}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* normal members */}
        {members.length > 0 ? (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={thisMemberRole}
              label="Members"
              count={members.length}
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map((m) => (
                <ServerMember key={m.id} member={m} server={server} />
              ))}
            </div>
          </div>
        ) : null}
      </ScrollArea>
    </aside>
  );
};
