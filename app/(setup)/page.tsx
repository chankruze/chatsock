/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 08:05:28 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import InitialModal from '@/components/modals/initial-modal';
import { prisma } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { redirect } from 'next/navigation';

export default async function page() {
  // check if the user has a profile if not create one
  const profile = await initialProfile();

  // fetch the first server the user is a member of
  const servers = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  // if the user has a server redirect to that server
  if (servers) {
    return redirect(`/servers/${servers.id}`);
  }

  // if the user doesn't have a server show the initial modal
  return <InitialModal />;
}
