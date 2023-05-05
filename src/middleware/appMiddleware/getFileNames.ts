import { NextFunction, Request, Response } from 'express';
import { readdir, stat } from 'fs/promises';
import { extname, join } from 'path';
const { WOPI_SERVER: wopiServer } = process.env;

export async function getFileNames(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!wopiServer) {
    res.sendStatus(503);

    return;
  }

  const folderPath = join(process.cwd(), 'files');

  const files = await readdir(folderPath);

  const data = {
    files: await Promise.all(files.map(async (f, i) => {
      const ext = extname(f);
      const id = (await stat(join(folderPath, f))).ino;

      return { id, name: f, ext: ext.startsWith('.') ? ext.replace('.', '') : ext };
    })),
    wopiServer,
  };

  res.send(data);
}
