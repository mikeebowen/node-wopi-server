// const { join } = require('path');
// const { writeFile } = require('fs/promises');
import { NextFunction, Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function createEmptyFile(req:Request, res: Response, next: NextFunction) {
  const { file_id: fileId } = req.params;
  const filePath = join(process.cwd(), 'files', fileId);

  try {
    await writeFile(filePath, Buffer.from(''), { flag: 'a' });

    res.sendStatus(200);
  } catch (err) {
    console.error((err as Error).message || err);
  }
}

;
