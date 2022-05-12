'use strict'

const { join, parse } = require('path')
const { existsSync } = require('fs')
const { readFile, readdir } = require('fs/promises')
const wopiStorageFolder = process.env.WOPI_STORAGE.split('/')
const { fileInfo } = require('../utils/')

module.exports = async (req, res, next) => {
  try {
    const i = parseInt(req.params.file_id)

    const folderPath = join(parse(process.cwd()).root, ...wopiStorageFolder)
    const fileName = isNaN(i) ? req.params.file_id : (await readdir(folderPath)).sort()[i]
    const filePath = join(folderPath, fileName)

    if (existsSync(filePath)) {
      const file = await readFile(filePath)
      if (fileInfo.info.Version) {
        res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version)
      }
      res.status(200)
      return res.send(file)
    } else {
      res.status(404)
      return res.send('not found')
    }
  } catch (err) {
    console.error(err.message || err)
    return res.sendStatus(500)
  }
}
