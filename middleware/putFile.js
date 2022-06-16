'use strict';
const { join, parse } = require('path');
const { stat, readdir } = require('fs/promises');
const { fileInfo, updateFile } = require('../utils/');

module.exports = async (req, res, next) => {
  const { file_id } = req.params;

  try {
    const filePath = await fileInfo.getFilePath(req.params.file_id);
    const lockValue = req.header('X-WOPI-Lock');
    const fileStats = await stat(filePath);

    if ((!fileStats.size && !Object.hasOwnProperty.call(fileInfo.lock, file_id)) || (lockValue && fileInfo.lock[file_id] === lockValue)) {
      fileInfo.lock[file_id] = lockValue;
      const time = await updateFile(filePath, req.rawBody, true);

      fileInfo.info.Version = time;

      return res.set({ 'X-WOPI-ItemVersion': time, 'X-WOPI-Lock': fileInfo.lock[file_id] || '' }).sendStatus(200);
    } else {
      res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '');
      return res.sendStatus(409);
    }
  } catch (error) {
    console.error(error.message || error);
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '');
    return res.sendStatus(409);
  }
};
