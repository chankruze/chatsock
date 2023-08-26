/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 06:27:25 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      {children}
    </div>
  );
}
