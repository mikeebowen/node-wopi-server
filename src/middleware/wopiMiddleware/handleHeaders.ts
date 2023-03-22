import { NextFunction, Request, Response } from 'express';
import { fileInfo } from '../../utils';
import { deleteFile, getLock, lock, putRelativeFile, refreshLock, unlock } from './index';

export function handleHeaders(req: Request, res: Response, next: NextFunction): void {
  const operation = req.header('X-WOPI-Override');

  const { file_id: fileId } = req.params;

  switch (operation) {
  case 'LOCK':
    lock(req, res, next);
    break;
  case 'UNLOCK':
    unlock(req, res, next);
    break;
  case 'REFRESH_LOCK':
    refreshLock(req, res, next);
    break;
  case 'GET_LOCK':
    getLock(req, res, next);
    break;
  case 'PUT_RELATIVE':
    putRelativeFile(req, res, next);
    // res.sendStatus(501)
    break;
  case 'DELETE':
    deleteFile(req, res, next);
    break;
  default:
    res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '');

    res.sendStatus(409);

    return;
  }
}
