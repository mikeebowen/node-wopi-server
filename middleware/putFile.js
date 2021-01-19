'use strict'
const { join, parse } = require('path')
const { existsSync, stat } = require('fs')
const { promisify } = require('util')
const { wopiStorageFolder } = require('../config')
const statPromise = promisify(stat)
const { fileInfo, updateFile } = require('../utils/')

module.exports = async (req, res, next) => {
  const { file_id } = req.params
  const filePath = join(parse(process.cwd()).root, wopiStorageFolder, file_id)
  const lockValue = req.header('X-WOPI-Lock')

  if (!existsSync(filePath)) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  }
  const stats = await statPromise(filePath)
  if ((!stats.size && !Object.hasOwnProperty.call(fileInfo.lock, file_id)) || (lockValue && fileInfo.lock[file_id] === lockValue)) {
    fileInfo.lock[file_id] = lockValue
    await updateFile(filePath, req.rawBody, true)
    res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version)
    return res.sendStatus(200)
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  }
}
