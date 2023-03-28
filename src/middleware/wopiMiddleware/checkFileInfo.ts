import { NextFunction, Request, Response } from 'express';
import { constants, Stats } from 'fs';
import { access, stat } from 'fs/promises';
import { userInfo } from 'os';
import { basename, extname } from 'path';
import { CheckFileInfoResponse } from '../../models';
import { fileInfo, getWopiMethods } from '../../utils';


export async function checkFileInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { WOPI_SERVER: wopiServer } = process.env;
    const { file_id: fileId } = req.params;
    const query = Object.entries(req.query).reduce(
      function(accumulator, [key, value]) {
        const q = key === 'access_token_ttl' ? 'access_token_ttl=0&' : `${key}=${value}&`;

        return accumulator + q;
      }, '') + `WOPISrc=${encodeURIComponent(wopiServer + req.originalUrl.split('?')[0])}`;

    if (!wopiServer) {
      throw new Error('WOPI_SERVER environment variable is not set');
    }

    if (!fileId) {
      throw new Error('file_id query parameter is required');
    }

    let fileStats: Stats;
    const filePath = await fileInfo.getFilePath(req.params.file_id);
    const fileName = basename(filePath);
    const actionUrls = (await getWopiMethods())[extname(filePath).replace('.', '')];
    const userName = req.query.access_token?.toString().split('|')[1] ?? userInfo().username;

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

    const editUrl = actionUrls.find((x: string[]) => x[0] === 'edit')[1];
    const viewUrl = actionUrls.find((x: string[]) => x[0] === 'view')[1];
    const hostEditUrl = `${editUrl}${editUrl.endsWith('?') ? '' : '&'}${query}`;
    const hostViewUrl = `${viewUrl}${viewUrl.endsWith('?') ? '' : '&'}${query}`;
    let isReadOnly = false;

    try {
      await access(filePath, constants.W_OK);
    } catch (err) {
      isReadOnly = true;
    }

    const info = new CheckFileInfoResponse({
      AllowExternalMarketplace: true,
      BaseFileName: fileName,
      BreadcrumbBrandName: 'LocalStorage WOPI Host',
      BreadcrumbBrandUrl: wopiServer,
      BreadcrumbDocName: fileName,
      BreadcrumbFolderName: 'WopiStorage',
      BreadcrumbFolderUrl: wopiServer,
      HostEditUrl: `http://mikee-pc:8888?action_url=${encodeURIComponent(hostEditUrl)}`,
      HostViewUrl: `http://mikee-pc:8888?action_url=${encodeURIComponent(hostViewUrl)}`,
      LastModifiedTime: new Date(fileStats.mtime).toISOString(),
      OwnerId: userName,
      ReadOnly: isReadOnly,
      Size: fileStats.size,
      SupportsCoauth: true,
      SupportsCobalt: false,
      SupportsDeleteFile: true,
      SupportsGetLock: true,
      SupportsLocks: true,
      SupportsRename: false,
      SupportsUpdate: true,
      UserCanWrite: true,
      UserFriendlyName: userName,
      UserId: userName,
      Version: fileStats.mtimeMs.toString(),
    });

    if (fileInfo?.info?.BaseFileName === fileName) {
      info.Version = fileInfo.info.Version;
    }

    fileInfo.info = info;

    res.send(fileInfo.info);
  } catch (err) {
    console.error((err as Error).message || err);

    res.sendStatus(404);

    return;
  }
}
