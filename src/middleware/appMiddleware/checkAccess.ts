import { NextFunction, Request, Response } from 'express';

export function checkAccess(req: Request, res: Response, next: NextFunction) {
  const accessToken = String(req.query?.access_token);
  const token = accessToken?.split('|')[0] ?? req.header('authorization');
  const ttl = req.query.access_token_ttl && typeof (req.query.access_token_ttl) === 'string' ? parseInt(req.query.access_token_ttl) : false;
  const now = Date.now();

  if (
    (token && typeof token === 'string' && token.toLowerCase() !== 'invalid') &&
    (!ttl || ttl > now)
  ) {
    next();
  } else {
    return res.status(401).send('Invalid Token');
  }
}
