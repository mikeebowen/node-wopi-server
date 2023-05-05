import { NextFunction, Request, Response } from 'express';

export function asyncHandler(fn: Function) {
  return function(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
}
