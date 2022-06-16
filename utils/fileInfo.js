'use strict';
const { readdir, stat } = require('fs/promises');
const { join } = require('path');

const fileInfo = {
  lock: {},
  info: {},
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
  getFilePath: async function (file_id) {
    if (Object.hasOwnProperty.call(this.idMap, file_id)) {
      return this.idMap[file_id];
    }

    const folderPath = join(process.cwd(), 'files');
    let fileName = file_id;

    for (let name of (await readdir(folderPath))) {
      const stats = await stat(join(folderPath, name));

      if (stats.ino.toString() === file_id) {
        fileName = name;
        break;
      }
    }

    const filePath = join(folderPath, fileName);
    this.idMap[file_id] = filePath;

    return filePath;
  },
  idMap: {},
};

Object.seal(fileInfo);

module.exports = fileInfo;
