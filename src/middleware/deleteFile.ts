import { NextFunction, Request, Response } from 'express';
import { unlink } from 'fs/promises';
import { fileInfo } from '../utils/';

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { file_id: fileId } = req.params;
    const filePath = await fileInfo.getFilePath(fileId);

    if (Object.hasOwnProperty.call(fileInfo.lock, fileId)) {
      const id = fileId as keyof typeof fileInfo.lock;

      res.header('X-WOPI-Lock', fileInfo.lock[id] || '');
      res.sendStatus(409);
    }

    await unlink(filePath);

    res.sendStatus(200);
  } catch (err) {
    console.error((err as Error).message || err);

    res.sendStatus(500);
  }
}
