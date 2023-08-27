/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 12:22:10 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ServerSidebarLeft } from '@/components/server/server-sidebar-left';
import { ServerSidebarRight } from '@/components/server/server-sidebar-right';
import { currentProfile } from '@/lib/current-profile';
import { prisma } from '@/lib/db';

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
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
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className="h-full relative">
      <div className="fixed inset-y-0 z-20 hidden h-full w-[var(--server-sidebar-width)] flex-col md:flex">
        <ServerSidebarLeft serverId={params.serverId} />
      </div>
      <main className="h-full md:px-[var(--server-sidebar-width)]">
        {children}
      </main>
      {/* TODO: another side panel for members */}
      <div className="fixed inset-y-0 right-0 z-20 hidden h-full w-[var(--server-sidebar-width)] flex-col bg-server-sidebar md:flex">
        <ServerSidebarRight serverId={params.serverId} />
      </div>
    </div>
  );
};

export default ServerIdLayout;
