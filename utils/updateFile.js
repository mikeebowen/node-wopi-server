'use strict'
const { stat, createWriteStream } = require('fs')
const { promisify } = require('util')
const statPromise = promisify(stat)
const fileInfo = require('./fileInfo')

module.exports = async function updateFile(filePath, rawBody) {
  const wStream = createWriteStream(filePath)
  wStream.write(rawBody)
  const fileStats = await statPromise(filePath)
  const time = new Date(fileStats.mtime).toISOString()
  fileInfo.info.Version = time
  return time
}
