'use strict'
const { createWriteStream } = require('fs')
const { stat } = require('fs/promises')
const fileInfo = require('./fileInfo')

module.exports = async function updateFile(filePath, rawBody, updateVersion) {
  try {
    const wStream = createWriteStream(filePath)
    wStream.write(rawBody)
    const fileStats = await stat(filePath)
    const time = fileStats.ctimeMs.toString()
    if (updateVersion) {
      fileInfo.info.Version = time
    }
    return time
  } catch (err) {
    console.error(err.message || err)
    throw new Error(err.message || err)
  }
}
