/*
Author: chankruze (chankruze@gmail.com)
Created: Sat Aug 26 2023 14:41:37 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-30 hidden h-full w-[var(--side-nav-width)] flex-col bg-red-300 md:flex">
        <NavigationSidebar />
      </div>
      <main className="h-full bg-blue-400 md:pl-[var(--side-nav-width)]">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
