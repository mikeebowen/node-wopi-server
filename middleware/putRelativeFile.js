'use strict'
const { parse, join } = require('path')
const { readdir } = require('fs')
const { promisify } = require('util')
const { fileInfo, updateFile } = require('../utils')
const { wopiStorageFolder } = require('../config')
const readdirPromise = promisify(readdir)

module.exports = async (req, res, next) => {
  const isRelative = req.header('X-WOPI-RelativeTarget')
  const isSuggested = req.header('X-WOPI-SuggestedTarget')
  const overwrite = req.header('X-WOPI-OverwriteRelativeTarget') || false
  if (!!isRelative === !!isSuggested) {
    return res.sendStatus(501)
  }
  const extension = (isRelative || isSuggested).split('.').pop()
  if (!fileInfo.supportedExtensions.includes(extension)) {
    return res.sendStatus(501)
  }
  if (isSuggested) {
    try {
      const fileName = isSuggested.startsWith('.') ? fileInfo.info.BaseFileName + isSuggested : isSuggested
      let newFileName = fileName
      const folderPath = join(parse(process.cwd()).root, wopiStorageFolder)

      const files = await readdirPromise(folderPath)
      let count = 1
      while (files.includes(newFileName)) {
        newFileName = `v${count}.${fileName}`
        count++
      }
      const filePath = join(folderPath, newFileName)
      await updateFile(filePath, req.rawBody)
      res.status(200)
      return res.json({
        Name: fileName,
        Url: `http://desktop-5h335mh:8888/wopi/files/${fileName}&access_token=DEADBEEFDEADBEEFDEADBEEF&access_token_ttl=0`,
      })
    } catch (err) {
      console.error(err.message || err)
    }
  } else {
    try {
      const fileName = isSuggested.startsWith('.') ? fileInfo.info.BaseFileName + isSuggested : isSuggested
      const folderPath = join(parse(process.cwd()).root, wopiStorageFolder)
      const filePath = join(folderPath, fileName)
      const exists = (await readdirPromise(folderPath)).includes(fileName)
      const isLocked = Object.hasOwnProperty.call(fileInfo.lock, fileName)

      if (overwrite || !exists || !isLocked) {
        await updateFile(filePath, req.rawBody)
        res.status(200)
        return res.json({
          Name: fileName,
          Url: `http://desktop-5h335mh:8888/wopi/files/${fileName}&access_token=DEADBEEFDEADBEEFDEADBEEF&access_token_ttl=0`,
        })
      }
      if (isLocked) {
        res.setHeader('X-WOPI-Lock', fileInfo.lock[fileName] || '')
        return res.sendStatus(409)
      }
    } catch (err) {
      console.error(err.message || err)
    }
  }
}
