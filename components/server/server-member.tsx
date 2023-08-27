/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 07:31:49 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import { Member, MemberRole, Profile, Server } from '@prisma/client';
import { Crown, ShieldCheck, Verified } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { UserAvatar } from '@/components/user-avatar';
import { cn } from '@/lib/utils';

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

export const roleIconMap = {
  [MemberRole.MEMBER]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <Verified className="ml-2 h-4 w-4 text-red-500" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon =
    server.ownerId === member.profileId ? (
      <Crown className="ml-2 h-4 w-4 text-yellow-500" />
    ) : (
      roleIconMap[member.role]
    );

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.avatar}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          params?.memberId === member.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
