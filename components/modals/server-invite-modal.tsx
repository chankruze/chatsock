/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 06:50:17 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import axios from 'axios';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';
import { cn } from '@/lib/utils';
import { MemberRole } from '@prisma/client';

export const ServerInviteModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';

  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { server, role } = data;

  if (!server) return null;

  const inviteUrl = `${origin}/invite/${server.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server.id}/invite-code`
      );

      onOpen('invite', { server: response.data, role });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-6 text-black">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Use this link to invite people to your server.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {/* if the user is admin, show generate new invite code button */}
          {role === MemberRole.ADMIN ? (
            <Button
              onClick={onNew}
              disabled={isLoading}
              variant="link"
              size="sm"
              className="mt-4 p-0 text-xs text-zinc-500"
            >
              Generate a new link
              <RefreshCw
                className={cn('ml-2 h-4 w-4', isLoading ? 'animate-spin' : '')}
              />
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
