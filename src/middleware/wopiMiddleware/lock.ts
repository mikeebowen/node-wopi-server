import { NextFunction, Request, Response } from 'express';
import { fileInfo } from '../../utils';

export function lock(req: Request, res: Response, next: NextFunction): void {
  const lockValue = req.header('X-WOPI-Lock');
  const oldLockValue = req.header('X-WOPI-OldLock');

  if (!lockValue) {
    res.sendStatus(400);

    return;
  }

  const { file_id: fileId } = req.params;

  if (
    !Object.hasOwnProperty.call(fileInfo.lock, fileId) ||
    fileInfo.lock[fileId] === lockValue ||
    fileInfo.lock[fileId] === oldLockValue
  ) {
    fileInfo.lock[fileId] = lockValue;

    if (fileInfo?.info?.Version) {
      res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version);
    }

    res.sendStatus(200);

    return;
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '');
    res.sendStatus(409);

    return;
  }
}
