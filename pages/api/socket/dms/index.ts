/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 14:51:12 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { NextApiRequest } from 'next';

import { currentProfile } from '@/lib/current-profile.server';
import { prisma } from '@/lib/db';
import { NextApiResponseServerIo } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfile(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID missing' });
    }

    if (!content) {
      return res.status(400).json({ error: 'Content missing' });
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
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const member =
      conversation.participantOne.profileId === profile.id
        ? conversation.participantOne
        : conversation.participantTwo;

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const message = await prisma.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        senderId: member.id,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log('[DIRECT_MESSAGES_POST]', error);
    return res.status(500).json({ message: 'Internal Error' });
  }
}
