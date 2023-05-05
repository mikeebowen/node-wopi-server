import { exec } from 'child_process';
import { decode } from 'emailjs-utf7';
import { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import { readdir, rename, stat } from 'fs/promises';
import { basename, extname, join } from 'path';
import { platform } from 'process';
import { promisify } from 'util';
import isValidFilename from 'valid-filename';
import { fileInfo } from '../../utils';
const execPromise = promisify(exec);

export async function renameFile(req:Request, res: Response, next: NextFunction) {
  try {
    const { file_id: fileId } = req.params;
    const filePath = await fileInfo.getFilePath(fileId);

    if (!existsSync(filePath)) {
      res.sendStatus(404);

      return;
    }

    const encodedRequestedName = req.header('X-WOPI-RequestedName');
    const requestedName = decode(encodedRequestedName);

    if (!isValidFilename(requestedName)) {
      res.setHeader('X-WOPI-InvalidFileNameError', 'Invalid file name');
      res.sendStatus(400);

      return;
    }

    const lock = req.header('X-WOPI-Lock');

    if (fileInfo?.lock[fileId] && lock !== fileInfo.lock[fileId]) {
      res.setHeader('X-WOPI-Lock', fileInfo.lock[fileId] ?? '').sendStatus(409);

      return;
    }

    const folderPath = join(process.cwd(), 'files');
    const files = await readdir(folderPath);
    let newRequestedName = requestedName;

    let count = 1;

    while (files.includes(newRequestedName)) {
      newRequestedName = `v${count}.${requestedName}`;
      count++;
    }

    const ext = extname(fileInfo?.info?.BaseFileName ?? '');
    const newRequestedNameWithExt = `${newRequestedName}${ext}`;
    const newFilePath = join(folderPath, newRequestedNameWithExt);

    if (!existsSync(newFilePath) && existsSync(filePath)) {
      if (platform === 'win32') {
        const command = `ren "${filePath}" "${newRequestedNameWithExt}"`;
        await execPromise(command);
      } else {
        await rename(filePath, newFilePath);
      }
    } else {
      res.sendStatus(409);

      return;
    }

    const id = (await stat(newFilePath)).ino.toString();
    fileInfo.idMap[basename(filePath)] = id;
    fileInfo.idMap[newRequestedNameWithExt] = id;

    if (fileInfo?.info) {
      fileInfo.info.BaseFileName = newRequestedName;
    }

    res.status(200).json({ Name: newRequestedName });
  } catch (err) {
    console.error(err);

    res.sendStatus(500);
  }
}
