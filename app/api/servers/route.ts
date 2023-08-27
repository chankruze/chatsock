/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 12:01:25 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { MemberRole } from '@prisma/client';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, icon } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await prisma.server.create({
      data: {
        ownerId: profile.id,
        name,
        icon,
        inviteCode: nanoid(8),
        channels: {
          create: [{ name: 'general', creatorId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
