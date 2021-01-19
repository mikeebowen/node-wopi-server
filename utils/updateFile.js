'use strict'
const { stat, createWriteStream } = require('fs')
const { promisify } = require('util')
const statPromise = promisify(stat)
const fileInfo = require('./fileInfo')

module.exports = async function updateFile(filePath, rawBody, updateVersion) {
  try {
    const wStream = createWriteStream(filePath)
    wStream.write(rawBody)
    if (updateVersion) {
      const fileStats = await statPromise(filePath)
      const time = new Date(fileStats.mtime).toISOString()
      fileInfo.info.Version = time
      return time
    }
  } catch (err) {
    console.error(err.message || err)
  }
}
