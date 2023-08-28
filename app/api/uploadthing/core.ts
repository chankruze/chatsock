/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 11:21:06 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { auth } from '@clerk/nextjs';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized');
  return { userId };
};

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),

  // This route takes an attached image OR video
  messageAttachment: f(['image', 'video', 'pdf', 'text/csv'])
    .middleware(({ req }) => handleAuth())
    .onUploadComplete((data) => console.log('file', data)),

  // Takes ONE image up to 2MB
  strictImageAttachment: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(({ req }) => handleAuth())
    .onUploadComplete((data) => console.log('file', data)),

  // Takes a 4 2mb images and/or 1 256mb video
  mediaPost: f({
    image: { maxFileSize: '2MB', maxFileCount: 4 },
    video: { maxFileSize: '256MB', maxFileCount: 1 },
  })
    .middleware(({ req }) => handleAuth())
    .onUploadComplete((data) => console.log('file', data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
