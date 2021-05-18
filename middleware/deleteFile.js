'use strict'
const { stat, unlink } = require('fs/promises')
const { join, parse } = require('path')
const { fileInfo } = require('../utils')
const wopiStorageFolder = process.env.WOPI_STORAGE.split(',')

module.exports = async (req, res, next) => {
  const { file_id } = req.params
  const filePath = join(parse(process.cwd()).root, ...wopiStorageFolder, file_id)
  if (Object.hasOwnProperty.call(fileInfo.lock, file_id)) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  }
  try {
    const stats = stat(filePath)
    await unlink(filePath)
  } catch (err) {
    console.error(err.message || err)
  }
}
