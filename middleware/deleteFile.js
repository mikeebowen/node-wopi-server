'use strict'
const { stat, unlink } = require('fs')
const { join, parse } = require('path')
const { promisify } = require('util')
const statPromise = promisify(stat)
const unlinkPromise = promisify(unlink)
const { fileInfo } = require('../utils')
const { wopiStorageFolder } = require('../config')

module.exports = async (req, res, next) => {
  const { file_id } = req.params
  const filePath = join(parse(process.cwd()).root, wopiStorageFolder, file_id)
  if (Object.hasOwnProperty.call(fileInfo.lock, file_id)) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  }
  try {
    const stats = statPromise(filePath)
    await unlinkPromise(filePath)
  } catch (err) {
    console.error(err.message || err)
  }
}
