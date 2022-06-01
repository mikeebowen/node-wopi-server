import { NextFunction, Request, Response } from 'express';

export const checkAccess = (req: Request, res: Response, next: NextFunction) => {
  const { access_token: accessToken } = req.query;
  const token = accessToken || req.header('authorization');

  if (token && typeof token === 'string' && token.toLowerCase() !== 'invalid') {
    next();
  } else {
    return res.status(401).send('Invalid Token');
  }
};
