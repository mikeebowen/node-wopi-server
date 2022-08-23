import { NextFunction, Request, Response } from 'express';
import { getWopiMethods } from '../../utils';

export async function getDiscoveryInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  const data = await getWopiMethods();
  res.send(data);
}
