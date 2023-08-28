/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 14:51:02 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

import { currentProfile } from '@/lib/current-profile.server';
import { prisma } from '@/lib/db';
import { NextApiResponseServerIo } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfile(req);
    const { dmId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' });
    }

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            participantOne: {
              profileId: profile.id,
            },
          },
          {
            participantTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        participantOne: {
          include: {
            profile: true,
          },
        },
        participantTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const member =
      conversation.participantOne.profileId === profile.id
        ? conversation.participantOne
        : conversation.participantTwo;

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let directMessage = await prisma.directMessage.findFirst({
      where: {
        id: dmId as string,
        conversationId: conversationId as string,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.isDeleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner = directMessage.senderId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'DELETE') {
      directMessage = await prisma.directMessage.update({
        where: {
          id: dmId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          isDeleted: true,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      directMessage = await prisma.directMessage.update({
        where: {
          id: dmId as string,
        },
        data: {
          content,
        },
        include: {
          sender: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log('[MESSAGE_ID]', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
