/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 01:42:55 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import { useEffect, useState } from 'react';

import { CreateChannelModal } from '@/components/modals/create-channel-modal';
import { CreateServerModal } from '@/components/modals/create-server-modal';
import { DeleteChannelModal } from '@/components/modals/delete-channel-modal';
import { DeleteServerModal } from '@/components/modals/delete-server-modal';
import { EditChannelModal } from '@/components/modals/edit-channel-modal';
import { EditServerModal } from '@/components/modals/edit-server-modal';
import { LeaveServerModal } from '@/components/modals/leave-server-modal';
import { ManageMembersModal } from '@/components/modals/manage-members-modal';
import { ServerInviteModal } from '@/components/modals/server-invite-modal';
import { MessageAttachmentModal } from '../modals/message-attachment-modal';

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevents SSR issues with react-modal and Next.js
  // not being able to detect the window object until after hydration
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <ServerInviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <DeleteServerModal />
      <LeaveServerModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <MessageAttachmentModal />
    </>
  );
};
