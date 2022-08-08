import { NextFunction, Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function createEmptyFile(req:Request, res: Response, next: NextFunction) {
  const { file_id: fileId } = req.params;
  const filePath = join(process.cwd(), 'files', fileId);

  try {
    await writeFile(filePath, new Uint8Array(Buffer.from('')));

    res.sendStatus(200);
  } catch (err) {
    console.error((err as Error).message || err);
    next(err);
  }
}
