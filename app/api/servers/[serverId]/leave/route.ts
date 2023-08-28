/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 06:47:25 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Server ID missing', { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        ownerId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_LEAVE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
