/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 10:18:42 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { Menu } from 'lucide-react';

import { NavigationSidebar } from '@/components/navigation/navigation-sidebar';
import { ServerSidebarLeft } from '@/components/server/server-sidebar-left';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebarLeft serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
