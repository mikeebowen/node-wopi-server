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
}

export class FileInfo {
  lock: {[key: string]: string};
  info?: CheckFileInfoResponse;
  supportedExtensions: string[];

  constructor(options: IFileInfo) {
    this.lock = options.lock || {};
    this.info = options.info;
    this.supportedExtensions = options.supportedExtensions;
  }
}
