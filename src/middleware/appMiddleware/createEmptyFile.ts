import { NextFunction, Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import { fileInfo } from '../../utils';

export async function createEmptyFile(req:Request, res: Response, next: NextFunction) {
  const { file_id: fileId } = req.params;
  const filePath = await fileInfo.getFilePath(fileId);

  await writeFile(filePath, new Uint8Array(Buffer.from('')));

  res.sendStatus(200);
}
