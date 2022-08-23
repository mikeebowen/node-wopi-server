import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { checkAccess, getRawBody } from '../middleware/appMiddleware';
import { appRouter, wopiRouter } from '../router';
import express = require('express');

export default class WopiServer {
  port: number;
  app: any;

  constructor(port?: number) {
    this.port = port ?? 3000;
    this.app = express();

    this.app.use(getRawBody);
    this.app.use('/wopi', checkAccess);
    this.app.use('/wopi', wopiRouter);
    this.app.use('/', appRouter);
    this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.sendFile(join(__dirname, 'index.html'));
    });
  }

  start = (): void => {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`server running on port ${this.port}`);
    });
  };
}
