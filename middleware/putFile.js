'use strict'
const { join, parse } = require('path')
const { stat, readdir } = require('fs/promises')
const { fileInfo, updateFile } = require('../utils/')

module.exports = async (req, res, next) => {
  const { file_id } = req.params

  try {
    const i = parseInt(file_id)

    const folderPath = join(process.cwd(), 'files')
    const fileName = isNaN(i) ? req.params.file_id : (await readdir(folderPath)).sort()[i]
    const filePath = join(folderPath, fileName)

    const lockValue = req.header('X-WOPI-Lock')
    const fileStats = await stat(filePath)

    if ((!fileStats.size && !Object.hasOwnProperty.call(fileInfo.lock, file_id)) || (lockValue && fileInfo.lock[file_id] === lockValue)) {
      fileInfo.lock[file_id] = lockValue
      const time = await updateFile(filePath, req.rawBody, true)
      res.setHeader('X-WOPI-ItemVersion', time)
      return res.sendStatus(200)
    } else {
      res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
      return res.sendStatus(409)
    }
  } catch (error) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  }
}
