import { existsSync } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { CheckFileInfoResponse } from './CheckFileInfoResponse';
interface IFileInfo {
  lock?: any;
  info?: CheckFileInfoResponse;
  supportedExtensions: [
    'doc',
    'docx',
    'dotx',
    'dot',
    'dotm',
    'xls',
    'xlsx',
    'xlsm',
    'xlm',
    'xlsb',
    'ppt',
    'pptx',
    'pps',
    'ppsx',
    'potx',
    'pot',
    'pptm',
    'potm',
    'ppsm',
    'pdf',
  ];
    // getFilePath(): Promise<string>;
  idMap: any;
}

export class FileInfo {
  lock: {[key: string]: string};
  info?: CheckFileInfoResponse;
  supportedExtensions: string[];
  idMap: any;

  constructor(options: IFileInfo) {
    this.lock = options.lock || {};
    this.info = options.info;
    this.supportedExtensions = options.supportedExtensions;
    this.idMap = options.idMap ?? {};
  }

  getFilePath = async (fileId: string): Promise<string> => {
    try {
      if (Object.hasOwnProperty.call(this.idMap, fileId)) {
        return this.idMap[fileId];
      }

      const folderPath = join(process.cwd(), 'files');
      let fileName = fileId;

      for (const name of (await readdir(folderPath))) {
        const curFilePath = join(folderPath, name);

        if (existsSync(curFilePath)) {
          const stats = await stat(curFilePath);

          if (stats.ino.toString() === fileId || name === fileId) {
            fileName = name;
            break;
          }
        }
      }

      const filePath = join(folderPath, fileName);
      this.idMap[fileId] = filePath;

      return filePath;
    } catch (err: any) {
      console.error((err as Error).message || err);

      return '';
    }
  };
}
