'use strict'
const { parse, join } = require('path')
const { readdir } = require('fs/promises')
const { decode } = require('utf7')
const { fileInfo, updateFile } = require('../utils')
const wopiStorageFolder = process.env.WOPI_STORAGE.split(',')

module.exports = async (req, res, next) => {
  const isRelative = req.header('X-WOPI-RelativeTarget')
  const isSuggested = req.header('X-WOPI-SuggestedTarget')
  const overwriteHeader = req.header('X-WOPI-OverwriteRelativeTarget')
  const overwrite = (overwriteHeader && overwriteHeader.toLowerCase() === 'true') || false

  if (!!isRelative === !!isSuggested) {
    return res.sendStatus(501)
  }

  if (isSuggested) {
    try {
      const fileName = isSuggested.startsWith('.') ? fileInfo.info.BaseFileName + isSuggested : isSuggested
      const decodedFileName = decode(fileName)
      let newFileName = decodedFileName
      const folderPath = join(parse(process.cwd()).root, ...wopiStorageFolder)

      const files = await readdir(folderPath)
      let count = 1
      while (files.includes(newFileName)) {
        newFileName = `v${count}.${decodedFileName}`
        count++
      }
      const filePath = join(folderPath, newFileName)
      await updateFile(filePath, req.rawBody, true)
      const myUrl = new URL(`http://localhost:3000/wopi/files/${newFileName}`)
      myUrl.searchParams.append('access_token', 'myVerySecretToken')
      const data = JSON.stringify({
        Name: newFileName,
        Url: myUrl.href,
      })
      return res.send(data)
    } catch (err) {
      console.error(err.message || err)
      return res.sendStatus(500)
    }
  } else {
    try {
      const fileName = isRelative.startsWith('.') ? fileInfo.info.BaseFileName + isRelative : isRelative
      const newFileName = decode(fileName)
      const folderPath = join(parse(process.cwd()).root, ...wopiStorageFolder)
      const filePath = join(folderPath, newFileName)
      const exists = (await readdir(folderPath)).includes(newFileName)
      const isLocked = Object.hasOwnProperty.call(fileInfo.lock, newFileName)

      if (overwrite && !exists) {
        await updateFile(filePath, req.rawBody, false)
        res.status(200)
      } else {
        if (isLocked) {
          res.setHeader('X-WOPI-Lock', fileInfo.lock[newFileName] || '')
        }
        res.status(409)
      }
      const myUrl = new URL(`http://localhost:3000/wopi/files/${newFileName}`)
      myUrl.searchParams.append('access_token', 'myVerySecretToken')
      return res.json({
        Name: newFileName,
        Url: myUrl.href,
      })
    } catch (err) {
      console.error(err.message || err)
      return res.sendStatus(500)
    }
  }
}
