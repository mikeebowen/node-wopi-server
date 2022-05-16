'use strict'
const { createWriteStream, existsSync } = require('fs')
const { stat, writeFile } = require('fs/promises')
const fileInfo = require('./fileInfo')

module.exports = async function updateFile(filePath, rawBody, updateVersion) {
  try {
    if (!existsSync(filePath)) {
      await writeFile(filePath, new Uint8Array(Buffer.from('')))
    }

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
    return 0
  }
}
