import { NextFunction, Request, Response } from 'express';

export function asyncHandler(fn: Function) {
  return async function(req: Request, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (err: unknown) {
      next(err);
    }
  };
}
