'use strict'
const { join } = require('path')
const { createWriteStream } = require('fs')
const { wopiStorageFolder, projectDir } = require('../config')

module.exports = (req, res, next) => {
  const filePath = join(projectDir, wopiStorageFolder, req.params.file_id)
  const wstream = createWriteStream(filePath)
  wstream.write(req.body)
  console.log('success')
  res.sendStatus(200)
}
