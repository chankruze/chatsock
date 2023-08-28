/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 10:49:59 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { prisma } from '@/lib/db';

export const getOrCreateConversation = async (
  participantOneId: string,
  participantTwoId: string
) => {
  // check if conversation exists between two participants either way
  let conversation =
    (await findConversation(participantOneId, participantTwoId)) ||
    (await findConversation(participantTwoId, participantOneId));

  // if no conversation exists, create a new one
  if (!conversation) {
    conversation = await createNewConversation(
      participantOneId,
      participantTwoId
    );
  }

  // return conversation
  return conversation;
};

const findConversation = async (
  participantOneId: string,
  participantTwoId: string
) => {
  try {
    return await prisma.conversation.findFirst({
      where: {
        AND: [
          { participantOneId: participantOneId },
          { participantTwoId: participantTwoId },
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
  } catch (e) {
    console.error(e);
    return null;
  }
};

const createNewConversation = async (
  participantOneId: string,
  participantTwoId: string
) => {
  try {
    return await prisma.conversation.create({
      data: {
        participantOneId,
        participantTwoId,
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
  } catch (e) {
    console.error(e);
    return null;
  }
};
