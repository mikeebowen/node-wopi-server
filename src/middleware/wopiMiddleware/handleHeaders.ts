import { NextFunction, Request, Response } from 'express';
import { fileInfo } from '../../utils';
import { deleteFile, getLock, lock, putRelativeFile, refreshLock, renameFile, unlock } from './index';

export async function handleHeaders(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = req.header('X-WOPI-Override') ?? '';


  const unsupported = [
    'ADD_ACTIVITIES',
    'CHECK_POLICY',
    'CHECK_USER_ACCESS',
    'COBALT',
    'GET_ACTIVITIES',
    'GET_FILE_USER_VALUE',
    'GET_RESTRICTED_LINK',
    'GET_SHARE_URL',
    'GRANT_USER_ACCESS',
    'PUT_USER_INFO',
    'READ_SECURE_STORE',
    'REVOKE_RESTRICTED_LINK',
    'SET_FILE_USER_VALUE',
  ];

  if (unsupported.includes(operation)) {
    res.sendStatus(501);

    return;
  }

  const { file_id: fileId } = req.params;

  switch (operation) {
    case 'DELETE':
      await deleteFile(req, res, next);
      break;
    case 'GET_LOCK':
      getLock(req, res, next);
      break;
    case 'LOCK':
      lock(req, res, next);
      break;
    case 'PUT_RELATIVE':
      await putRelativeFile(req, res, next);
      break;
    case 'REFRESH_LOCK':
      refreshLock(req, res, next);
      break;
    case 'RENAME_FILE':
      await renameFile(req, res, next);
      break;
    case 'UNLOCK':
      unlock(req, res, next);
      break;
    default:
      res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] ?? '').sendStatus(409);
  }
}
