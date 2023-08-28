/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 11:38:09 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import { useSocket } from '@/components/providers/socket-provider';
import { Badge } from '@/components/ui/badge';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 text-white">
        Disconnected
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      Connected
    </Badge>
  );
};
