/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 07:38:14 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import { ChannelType, MemberRole } from '@prisma/client';
import { Minus, Plus, Settings } from 'lucide-react';

import { ActionTooltip } from '@/components/action-tooltip';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';

interface ServerSectionProps {
  label: string;
  count?: number;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  count,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();

  return (
    <div className="flex items-center justify-between py-2">
      <p className="flex items-center gap-1 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        {count ? (
          <>
            <Minus className="h-4 w-4" />
            <span>{count}</span>
          </>
        ) : null}
      </p>
      {role !== MemberRole.MEMBER && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button
            onClick={() => onOpen('createChannel', { channelType })}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage Members" side="top">
          <button
            onClick={() => onOpen('members', { server })}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
