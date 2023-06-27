import { NextFunction, Request, Response } from 'express';
import { fileInfo } from '../../utils';
import { deleteFile, getLock, lock, putRelativeFile, refreshLock, renameFile, unlock } from './index';

export async function handleHeaders(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = req.header('X-WOPI-Override');

  const { file_id: fileId } = req.params;

  switch (operation) {
    case 'ADD_ACTIVITIES':
      res.sendStatus(501);
      break;
    case 'CHECK_POLICY':
      res.sendStatus(501);
      break;
    case 'CHECK_USER_ACCESS':
      res.sendStatus(501);
      break;
    case 'DELETE':
      await deleteFile(req, res, next);
      break;
    case 'COBALT':
      res.sendStatus(501);
      break;
    case 'GET_ACTIVITIES':
      res.sendStatus(501);
      break;
    case 'GET_FILE_USER_VALUE':
      res.sendStatus(501);
      break;
    case 'GET_LOCK':
      getLock(req, res, next);
      break;
    case 'GET_RESTRICTED_LINK':
      res.sendStatus(501);
      break;
    case 'GET_SHARE_URL':
      res.sendStatus(501);
      break;
    case 'GRANT_USER_ACCESS':
      res.sendStatus(501);
      break;
    case 'LOCK':
      lock(req, res, next);
      break;
    case 'PUT_RELATIVE':
      await putRelativeFile(req, res, next);
      break;
    case 'PUT_USER_INFO':
      res.sendStatus(501);
      break;
    case 'READ_SECURE_STORE':
      res.sendStatus(501);
      break;
    case 'REFRESH_LOCK':
      refreshLock(req, res, next);
      break;
    case 'RENAME_FILE':
      await renameFile(req, res, next);
      break;
    case 'REVOKE_RESTRICTED_LINK':
      res.sendStatus(501);
      break;
    case 'SET_FILE_USER_VALUE':
      res.sendStatus(501);
      break;
    case 'UNLOCK':
      unlock(req, res, next);
      break;
    default:
      res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] ?? '').sendStatus(409);
  }
}
