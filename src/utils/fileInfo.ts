import { FileInfo } from '../models';

export const fileInfo = new FileInfo({
  lock: undefined,
  info: undefined,
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
  ],
  idMap: {},
});
Object.seal(fileInfo);

