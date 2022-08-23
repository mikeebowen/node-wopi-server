import { NextFunction, Response } from 'express';
import { ICustomRequest } from '../../models';

export function getRawBody(req: ICustomRequest, res: Response, next: NextFunction): void {
  const data: Uint8Array[] = [];

  req.on('data', (chunk) => {
    data.push(chunk);
  });

  req.on('end', () => {
    req.rawBody = Buffer.concat(data);
    next();
  });
}

;
