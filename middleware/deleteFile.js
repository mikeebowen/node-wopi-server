'use strict';
const { unlink, readdir } = require('fs/promises');
const { join, parse } = require('path');
const { fileInfo } = require('../utils');

module.exports = async (req, res, next) => {
  const { file_id } = req.params;

  const filePath = await fileInfo.getFilePath(req.params.file_id);

  if (Object.hasOwnProperty.call(fileInfo.lock, file_id)) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '');
    return res.sendStatus(409);
  }
  try {
    await unlink(filePath);
    return res.sendStatus(200);
  } catch (err) {
    console.error(err.message || err);
    return res.sendStatus(500);
  }
};
