'use strict'

const { join, parse } = require('path')
const { existsSync } = require('fs')
const { readFile } = require('fs/promises')
const { wopiStorageFolder } = require('../config')
const { fileInfo } = require('../utils/')

module.exports = async (req, res, next) => {
  try {
    const filePath = join(parse(process.cwd()).root, wopiStorageFolder, req.params.file_id)
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
    return console.error(err.message || err)
  }
}
