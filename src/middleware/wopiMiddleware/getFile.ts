import { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { fileInfo } from '../../utils';

export async function getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { file_id: fileId } = req.params;
  const filePath = await fileInfo.getFilePath(fileId);

  if (existsSync(filePath)) {
    const file = await readFile(filePath);

    if (fileInfo?.info?.Version) {
      res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version);
    }

    res.status(200).send(file);
  } else {
    res.sendStatus(404);
  }
}
