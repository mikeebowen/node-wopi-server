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
  const overwriteHeader = req.header('X-WOPI-OverwriteRelativeTarget')
  const overwrite = (overwriteHeader && overwriteHeader.toLowerCase() === 'true') || false
  if (!!isRelative === !!isSuggested) {
    return res.sendStatus(501)
  }
  const extension = (isRelative || isSuggested).split('.').pop()
  // if (!fileInfo.supportedExtensions.includes(extension)) {
  //   return res.sendStatus(501)
  // }
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
      await updateFile(filePath, req.rawBody, false)
      res.status(200)
      const myUrl = new URL(`http://desktop-5h335mh:8888/wopi/files/${fileName}`)
      myUrl.searchParams.append('access_token', 'myVerySecretToken')
      return res.json({
        Name: fileName,
        Url: myUrl.href,
      })
    } catch (err) {
      console.error(err.message || err)
    }
  } else {
    try {
      const fileName = isRelative.startsWith('.') ? fileInfo.info.BaseFileName + isRelative : isRelative
      const folderPath = join(parse(process.cwd()).root, wopiStorageFolder)
      const filePath = join(folderPath, fileName)
      const exists = (await readdirPromise(folderPath)).includes(fileName)
      const isLocked = Object.hasOwnProperty.call(fileInfo.lock, fileName)

      if (overwrite || !exists) {
        await updateFile(filePath, req.rawBody, false)
        res.status(200)
      } else {
        if (isLocked) {
          res.setHeader('X-WOPI-Lock', fileInfo.lock[fileName] || '')
        }
        res.status(409)
      }
      const myUrl = new URL(`http://desktop-5h335mh:8888/wopi/files/${fileName}`)
      myUrl.searchParams.append('access_token', 'myVerySecretToken')
      return res.json({
        Name: fileName,
        Url: myUrl.href,
      })
    } catch (err) {
      console.error(err.message || err)
    }
  }
}
