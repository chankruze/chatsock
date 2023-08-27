/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 12:10:54 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';
import { nanoid } from 'nanoid';

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
      return new NextResponse('Server ID Missing', { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: 'ADMIN',
          },
        },
      },
      data: {
        inviteCode: nanoid(8),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
