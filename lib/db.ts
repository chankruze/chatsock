/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 08:00:23 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
