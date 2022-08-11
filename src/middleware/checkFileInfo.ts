import { NextFunction, Request, Response } from 'express';
import { Stats } from 'fs';
import { readdir, stat } from 'fs/promises';
import { userInfo } from 'os';
import { join } from 'path';
import { CheckFileInfoResponse } from '../models';
import { fileInfo } from '../utils';


export async function checkFileInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { WOPI_SERVER: wopiServer } = process.env;
    const { file_id: fileId } = req.params;

    if (!wopiServer) {
      throw new Error('WOPI_SERVER environment variable is not set');
    }

    if (!fileId) {
      throw new Error('file_id query parameter is required');
    }

    let fileStats: Stats;
    const i = parseInt(fileId);
    const folderPath = join(process.cwd(), 'files');
    const fileName = isNaN(i) ? fileId : (await readdir(folderPath)).sort()[i];
    const filePath = join(folderPath, fileName);

    try {
      fileStats = await stat(filePath);
    } catch (err) {
      fileStats = {
        dev: 2114,
        ino: 48064969,
        mode: 33188,
        nlink: 1,
        uid: 85,
        gid: 100,
        rdev: 0,
        size: 527,
        blksize: 4096,
        blocks: 8,
        atimeMs: 1318289051000.1,
        mtimeMs: 1318289051000.1,
        ctimeMs: 1318289051000.1,
        birthtimeMs: 1318289051000.1,
        atime: new Date(),
        mtime: new Date(),
        ctime: new Date(),
        birthtime: new Date(),
      } as Stats;
    }

    const info = new CheckFileInfoResponse({
      BaseFileName: fileName,
      OwnerId: userInfo().uid.toString(),
      // Size: 100,
      Size: fileStats.size,
      UserId: userInfo().username,
      UserFriendlyName: userInfo().username,
      // Version: new Date(fileStats.mtime).toISOString(),
      Version: fileStats.ctimeMs.toString(),
      // Version: 'foobar',
      SupportsLocks: true,
      SupportsGetLock: true,
      SupportsDeleteFile: true,
      // WebEditingDisabled: false,
      UserCanWrite: true,
      SupportsUpdate: true,
      // SupportsRename: true,
      SupportsRename: false,
      SupportsCobalt: false,
      // LastModifiedTime: new Date(),
      LastModifiedTime: new Date(fileStats.mtime).toISOString(),
      BreadcrumbBrandName: 'LocalStorage WOPI Host',
      BreadcrumbBrandUrl: wopiServer,
      BreadcrumbFolderName: 'WopiStorage',
      BreadcrumbFolderUrl: wopiServer,
      BreadcrumbDocName: fileName,
      ReadOnly: false,
    });

    if (fileInfo?.info?.BaseFileName === fileName) {
      const combined = Object.assign(info, fileInfo.info);

      fileInfo.info = combined;
    } else {
      fileInfo.info = info;
    }

    const r = fileInfo;

    res.send(fileInfo.info);
  } catch (err) {
    console.error((err as Error).message || err);

    res.sendStatus(404);

    return;
  }
}

;
