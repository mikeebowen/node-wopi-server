import { NextFunction, Request, Response } from 'express';
import { fileInfo } from '../../utils';

export function getLock(req: Request, res: Response, next: NextFunction): void {
  const { file_id: fileId } = req.params;
  // const lockValue = req.header('X-WOPI-Lock')

  if (!Object.hasOwnProperty.call(fileInfo.lock, fileId)) {
    res.setHeader('X-WOPI-Lock', '');
    res.sendStatus(200);
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '');
    res.sendStatus(200);
  }
}
