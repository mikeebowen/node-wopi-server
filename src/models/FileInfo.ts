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
    this.lock = options.lock ?? {};
    this.info = options.info;
    this.supportedExtensions = options.supportedExtensions;
    this.idMap = options.idMap ?? {};
  }

  getFilePath = async (fileId: string): Promise<string> => {
    try {
      let id = '';

      if (Object.hasOwnProperty.call(this.idMap, fileId)) {
        id = this.idMap[fileId];
      }

      const folderPath = join(process.cwd(), 'files');
      const files = await readdir(folderPath);

      for (const name of files) {
        const curFilePath = join(folderPath, name);

        if (existsSync(curFilePath)) {
          const stats = await stat(curFilePath);
          const n = stats.ino.toString();

          if (n === fileId || name === fileId) {
            this.idMap[name] = n;
            id = n;

            break;
          }
        }
      }

      for (const name of files) {
        const fp = join(folderPath, name);

        const stats = await stat(fp);

        if (stats.ino.toString() === id) {
          return fp;
        }
      }

      return id;
    } catch (err: any) {
      console.error((err as Error).message || err);

      return '';
    }
  };
}
