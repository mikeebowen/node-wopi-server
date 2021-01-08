'use strict'

const { join, resolve } = require('path')
const { readFile, existsSync } = require('fs')
const { promisify } = require('util')
let readFilePromise = promisify(readFile)
const { wopiStorageFolder, projectDir } = require('../config')

module.exports = async (req, res, next) => {
  try {
    const filePath = join(resolve('./'), wopiStorageFolder, req.params.file_id)
    if (existsSync(filePath)) {
      const file = await readFilePromise(filePath)
      res.status(200)
      res.send(file)
    } else {
      res.status(404)
      res.send('not found')
    }
  } catch (err) {
    console.error(err.message || err)
  }
}
