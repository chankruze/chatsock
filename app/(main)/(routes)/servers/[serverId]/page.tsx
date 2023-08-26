/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 12:22:24 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await prisma.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  if (initialChannel?.name !== 'general') {
    return null;
  }

  // TODO: uncomment this
  // return redirect(`/servers/${params.serverId}/channels/${initialChannel?.id}`);
  return (
    <div>
      <pre className="overflow-auto">{JSON.stringify(server, null, 2)}</pre>
    </div>
  );
};

export default ServerIdPage;
