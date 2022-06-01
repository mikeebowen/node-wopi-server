import { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileInfo } from '../utils';

export async function getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const i = parseInt(req.params.file_id);

    const folderPath = join(process.cwd(), 'files');
    const fileName = isNaN(i) ? req.params.file_id : (await readdir(folderPath)).sort()[i];
    const filePath = join(folderPath, fileName);

    if (existsSync(filePath)) {
      const file = await readFile(filePath);

      if (fileInfo?.info?.Version) {
        res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version);
      }

      res.status(200);

      res.send(file);
    } else {
      res.status(404);

      res.send('not found');
    }
  } catch (err) {
    console.error((err as Error)?.message || err);

    res.sendStatus(500);
  }
}

;
