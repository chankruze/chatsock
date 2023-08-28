/*
Author: chankruze (chankruze@gmail.com)
Created: Mon Aug 28 2023 11:25:53 GMT-0400 (Eastern Daylight Time)

Copyright (c) geekofia 2023 and beyond
*/

import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';

import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;
