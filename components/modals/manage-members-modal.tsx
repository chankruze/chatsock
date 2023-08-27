/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 17:28:33 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import { MemberRole } from '@prisma/client';
import axios from 'axios';
import {
    Check,
    Crown,
    Gavel,
    Loader2,
    MoreVertical,
    Shield,
    ShieldCheck,
    ShieldQuestion,
    User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/types';

const roleIconMap = {
  MEMBER: null,
  MODERATOR: <Shield className="ml-2 h-4 w-4 text-yellow-500" />,
  ADMIN: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
};

export const ManageMembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'members';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen('members', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]">
          {server?.members?.map((member) => (
            <div key={member.id} className="mb-6 flex items-center gap-x-2">
              <UserAvatar src={member.profile.avatar} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center gap-x-1 text-xs font-semibold">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                  {server.ownerId === member.profileId ? (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  ) : null}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.ownerId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="mr-2 h-4 w-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MEMBER')
                                }
                              >
                                <User className="mr-2 h-4 w-4" />
                                Member
                                {member.role === 'MEMBER' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'ADMIN')}
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Admin
                                {member.role === 'ADMIN' && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <Gavel className="mr-2 h-4 w-4" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="ml-auto h-4 w-4 animate-spin text-zinc-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
