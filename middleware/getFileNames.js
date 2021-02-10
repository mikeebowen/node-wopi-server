'use strict'
const { join, parse } = require('path')
const { existsSync } = require('fs')
const { readdir } = require('fs/promises')
const { wopiStorageFolder } = require('../config')

module.exports = async (req, res, next) => {
  const folderPath = join(parse(process.cwd()).root, wopiStorageFolder)
  if (existsSync(folderPath)) {
    const files = await readdir(folderPath)
    res.send(files)
  } else {
    res.sendStatud(404)
  }
}
