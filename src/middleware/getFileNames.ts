import { NextFunction, Request, Response } from 'express';
import { readdir } from 'fs/promises';
import { extname, join } from 'path';
const { WOPI_SERVER: wopiServer } = process.env;

export async function getFileNames(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!wopiServer) {
    res.sendStatus(500);

    return;
  }

  try {
    const folderPath = join(process.cwd(), 'files');
    const files = (await readdir(folderPath)).sort();

    res.send({
      files: files.map((f, i) => {
        const ext = extname(f);

        return { id: i, name: f, ext: ext.startsWith('.') ? ext.replace('.', '') : ext };
      }),
      wopiServer: wopiServer,
    });
  } catch (error) {
    res.sendStatus(404);
  }
}

;
