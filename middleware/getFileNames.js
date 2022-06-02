'use strict';
const { join, parse, extname } = require('path');
const { readdir, stat } = require('fs/promises');

module.exports = async (req, res, next) => {
  const folderPath = join(process.cwd(), 'files');

  try {
    const files = await readdir(folderPath);

    const data = {
      files: await Promise.all(files.map(async (f, i) => {
        const ext = extname(f);
        const id = (await stat(join(folderPath, f))).ino;

        return { id, name: f, ext: ext.startsWith('.') ? ext.replace('.', '') : ext };
      })),
      wopiServer: process.env.WOPI_SERVER,
    };

    res.send(data);
  } catch (error) {
    return res.sendStatus(404);
  }
};
