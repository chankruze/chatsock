/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 11:32:09 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL,
      {
        path: '/api/socket/io',
        addTrailingSlash: false,
      }
    );

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
