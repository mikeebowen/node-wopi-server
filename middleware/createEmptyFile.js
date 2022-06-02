const { join } = require('path');
const { writeFile } = require('fs/promises');
const { fileInfo } = require('../utils');

module.exports = async (req, res, next) => {
  const { file_id } = req.params;
  const filePath = await fileInfo.getFilePath(file_id);

  try {
    await writeFile(filePath, Buffer.from(''), { flag: 'a' });
    res.sendStatus('200');
  } catch (err) {
    console.error(err.message || err);
  }
};
