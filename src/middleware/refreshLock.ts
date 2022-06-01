import { NextFunction, Request, Response } from 'express';
import { fileInfo } from '../utils';

export function refreshLock(req: Request, res: Response, next: NextFunction): void {
  const lockValue = req.header('X-WOPI-Lock');

  if (!lockValue) {
    res.sendStatus(400);

    return;
  }

  const { file_id: fileId } = req.params;

  if (fileInfo.lock[fileId] === lockValue) {
    if (fileInfo?.info?.Version) {
      res.setHeader('X-WOPI-ItemVersion', fileInfo?.info?.Version);
    }


    res.sendStatus(200);

    return;
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '');

    res.sendStatus(409);

    return;
  }
}

;
