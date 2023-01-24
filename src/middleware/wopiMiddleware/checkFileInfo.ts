import { NextFunction, Request, Response } from 'express';
import { Stats } from 'fs';
import { stat } from 'fs/promises';
import { userInfo } from 'os';
import { basename } from 'path';
import { CheckFileInfoResponse } from '../../models';
import { fileInfo } from '../../utils';


export async function checkFileInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { WOPI_SERVER: wopiServer } = process.env;
    const { file_id: fileId } = req.params;
    // const query = Object.entries(req.query).reduce(
    //   function(accumulator, [key, value]) {
    //     const q = key === 'access_token_ttl' ? `access_token_ttl=${Date.now() + 300000}&` : `${key}=${value}&`;

    //     return accumulator + q;
    //   }, '') + `WOPISrc=${encodeURIComponent(wopiServer + req.originalUrl.split('?')[0])}`;

    if (!wopiServer) {
      throw new Error('WOPI_SERVER environment variable is not set');
    }

    if (!fileId) {
      throw new Error('file_id query parameter is required');
    }

    let fileStats: Stats;
    const filePath = await fileInfo.getFilePath(req.params.file_id);
    const fileName = basename(filePath);
    // const actionUrls = (await getWopiMethods())[extname(filePath).replace('.', '')];

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

    // const editUrl = actionUrls.find((x: string[]) => x[0] === 'edit')[1];
    // const viewUrl = actionUrls.find((x: string[]) => x[0] === 'view')[1];
    // const hostEditUrl = `${editUrl}${editUrl.endsWith('?') ? '' : '&'}${query}`;
    // const hostViewUrl = `${viewUrl}${viewUrl.endsWith('?') ? '' : '&'}${query}`;

    const info = new CheckFileInfoResponse({
      BaseFileName: fileName,
      OwnerId: userInfo().uid.toString(),
      Size: fileStats.size,
      UserId: userInfo().username,
      UserFriendlyName: userInfo().username,
      Version: fileStats.mtimeMs.toString(),
      SupportsLocks: true,
      SupportsGetLock: true,
      SupportsDeleteFile: true,
      // WebEditingDisabled: false,
      UserCanWrite: true,
      SupportsUpdate: true,
      SupportsRename: false,
      SupportsCobalt: false,
      LastModifiedTime: new Date(fileStats.mtime).toISOString(),
      BreadcrumbBrandName: 'LocalStorage WOPI Host',
      BreadcrumbBrandUrl: wopiServer,
      BreadcrumbFolderName: 'WopiStorage',
      BreadcrumbFolderUrl: wopiServer,
      BreadcrumbDocName: fileName,
      ReadOnly: false,
      // HostEditUrl: hostEditUrl,
      // HostViewUrl: hostViewUrl,
    });

    if (fileInfo?.info?.BaseFileName === fileName) {
      const combined = Object.assign(info, fileInfo.info);

      fileInfo.info = combined;
    } else {
      fileInfo.info = info;
    }

    res.send(fileInfo.info);
  } catch (err) {
    console.error((err as Error).message || err);

    res.sendStatus(404);

    return;
  }
}

;
