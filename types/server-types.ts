/*
Author: chankruze (chankruze@gmail.com)
Created: Sun Aug 27 2023 03:09:00 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
