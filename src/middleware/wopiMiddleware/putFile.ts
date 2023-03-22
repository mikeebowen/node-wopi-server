import { NextFunction, Response } from 'express';
import { stat } from 'fs/promises';
import { ICustomRequest } from '../../models/ICustomRequest';
import { fileInfo, updateFile } from '../../utils';

export async function putFile(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
  const { file_id: fileId } = req.params;

  try {
    const filePath = await fileInfo.getFilePath(fileId);
    const lockValue = req.header('X-WOPI-Lock');
    const fileStats = await stat(filePath);

    if ((!fileStats.size && !Object.hasOwnProperty.call(fileInfo.lock, fileId)) || (lockValue && fileInfo.lock[fileId] === lockValue)) {
      if (lockValue) {
        fileInfo.lock[fileId] = lockValue;
      }

      const time = await updateFile(filePath, req.rawBody ?? Buffer.from(''), true);

      res.setHeader('X-WOPI-ItemVersion', time).sendStatus(200);

      return;
    } else {
      res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '').sendStatus(409);

      return;
    }
  } catch (error) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '').sendStatus(409);

    return;
  }
}
