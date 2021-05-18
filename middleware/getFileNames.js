'use strict'
const { join, parse, extname } = require('path')
const { existsSync } = require('fs')
const { readdir } = require('fs/promises')
const wopiStorageFolder = process.env.WOPI_STORAGE.split(',')

module.exports = async (req, res, next) => {
  const folderPath = join(parse(process.cwd()).root, ...wopiStorageFolder)
  try {
    const files = await readdir(folderPath)
    res.send(
      files.map(f => {
        const ext = extname(f)
        return { name: f, ext: ext.startsWith('.') ? ext.replace('.', '') : ext }
      }),
    )
  } catch (error) {
    res.sendStatus(404)
  }
}
