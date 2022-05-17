'use strict';
const { readdir } = require('fs/promises');
const { join, extname } = require('path');
const { decode } = require('utf7');
const { updateFile } = require('../utils');

module.exports = async function (req, res, next) {
  try {
    const files = await readdir(join(process.cwd(), 'files'));
    let { file_name } = req.query;
    const decodedFileName = decode(file_name);
    let newFileName = decodedFileName;
    let count = 1;

    while (files.includes(newFileName)) {
      newFileName = `v${count}.${decodedFileName}`;
      count++;
    }

    await updateFile(join(process.cwd(), 'files', newFileName), req.rawBody);

    const newFiles = await readdir(join(process.cwd(), 'files'));
    newFiles.sort();

    res.status = 201;

    return res.json({
      new_file: newFileName,
      files: newFiles.map((f, i) => {
        const ext = extname(f);
        return { id: i, name: f, ext: ext.startsWith('.') ? ext.replace('.', '') : ext };
      }),
    });
  } catch (err) {
    console.error(err.message || err);
    return res.status(500);
  }
};