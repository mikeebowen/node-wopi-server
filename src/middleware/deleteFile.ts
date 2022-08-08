import { NextFunction, Request, Response } from 'express';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { fileInfo } from '../utils/';

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { file_id: fileId } = req.params;
    const i = parseInt(fileId);

    const folderPath = join(process.cwd(), 'files');
    const fileName = isNaN(i) ? fileId : (await readdir(folderPath)).sort()[i];
    const filePath = join(folderPath, fileName);

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
