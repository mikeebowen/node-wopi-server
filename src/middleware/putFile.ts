// 'use strict';
// const { join } = require('path');
// const { stat, readdir } = require('fs/promises');
// const { fileInfo, updateFile } = require('../utils/');
import { NextFunction, Response } from 'express';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { ICustomRequest } from '../models/ICustomRequest';
import { fileInfo, updateFile } from '../utils';

export async function putFile(req: ICustomRequest, res: Response, next: NextFunction): Promise<void> {
  const { file_id: fileId } = req.params;

  try {
    const i = parseInt(fileId);

    const folderPath = join(process.cwd(), 'files');
    const fileName = isNaN(i) ? req.params.file_id : (await readdir(folderPath)).sort()[i];
    const filePath = join(folderPath, fileName);

    const lockValue = req.header('X-WOPI-Lock');
    const fileStats = await stat(filePath);

    if ((!fileStats.size && !Object.hasOwnProperty.call(fileInfo.lock, fileId)) || (lockValue && fileInfo.lock[fileId] === lockValue)) {
      fileInfo.lock[fileId] = lockValue ?? '';

      const time = await updateFile(filePath, req.rawBody ?? Buffer.from(''), true);

      res.setHeader('X-WOPI-ItemVersion', time);

      res.sendStatus(200);

      return;
    } else {
      res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '');

      res.sendStatus(409);

      return;
    }
  } catch (error) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] || '');
    res.sendStatus(409);

    return;
  }
}

;
