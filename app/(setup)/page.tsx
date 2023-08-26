/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 08:05:28 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { prisma } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { redirect } from 'next/navigation';

export default async function page() {
  const profile = await initialProfile();

  console.log(profile);

  const servers = await prisma.server.findFirst({
    where: {
      members: {
        some: {
          id: profile.id,
        },
      },
    },
  });

  console.log(servers);

  if (servers) {
    return redirect(`/servers/${servers.id}`);
  }

  return <div>Create A Server</div>;
}
