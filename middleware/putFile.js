'use strict'
const { join, parse } = require('path')
const { createWriteStream, existsSync, stat } = require('fs')
const { promisify } = require('util')
const { wopiStorageFolder } = require('../config')
const statPromise = promisify(stat)
const fileInfo = require('./fileInfo')

module.exports = async (req, res, next) => {
  const { file_id } = req.params
  const filePath = join(parse(process.cwd()).root, wopiStorageFolder, file_id)
  const lockValue = req.header('X-WOPI-Lock')

  if (!existsSync(filePath)) {
    return res.sendStatus(409)
  }
  const stats = await statPromise(filePath)
  if (stats.size) {
    if (lockValue && fileInfo.lock[file_id] === lockValue) {
      const wstream = createWriteStream(filePath)
      wstream.write(req.rawBody)
      const fileStats = await statPromise(filePath)
      fileInfo.info.Version = fileStats.ctimeMs.toString()
      res.setHeader('X-WOPI-ItemVersion', fileStats.ctimeMs.toString())
      return res.sendStatus(200)
    } else {
      res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
      return res.sendStatus(409)
    }
  }
  if (!Object.hasOwnProperty.call(fileInfo.lock, file_id) || (lockValue && fileInfo.lock[file_id] === lockValue)) {
    fileInfo.lock[file_id] = lockValue
    const wStream = createWriteStream(filePath)
    wStream.write(req.rawBody)
    const fileStats = await statPromise(filePath)
    fileInfo.info.Version = fileStats.ctimeMs.toString()
    res.setHeader('X-WOPI-ItemVersion', fileStats.ctimeMs.toString())
    return res.sendStatus(200)
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  }
}
