'use strict'
const { parse, join } = require('path')
const { readdir } = require('fs/promises')
const { decode } = require('utf7')
const validFileName = require('valid-filename')
const { fileInfo, updateFile } = require('../utils')
const wopiStorageFolder = process.env.WOPI_STORAGE.split(',')
const { WOPI_SERVER } = process.env
module.exports = async (req, res, next) => {
  const isRelative = req.header('X-WOPI-RelativeTarget')
  const isSuggested = req.header('X-WOPI-SuggestedTarget')
  const overwriteHeader = req.header('X-WOPI-OverwriteRelativeTarget')
  const overwrite = (overwriteHeader && overwriteHeader.toLowerCase() === 'true') || false

  if (!!isRelative === !!isSuggested) {
    return res.sendStatus(400)
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

      if (!validFileName(newFileName)) {
        return res.sendStatus(400)
      }

      const filePath = join(folderPath, newFileName)

      await updateFile(filePath, req.rawBody, true)

      const myUrl = new URL(`${WOPI_SERVER}/wopi/files/${newFileName}`)
      myUrl.searchParams.append('access_token', 'myVerySecretToken')

      return res.json({
        Name: newFileName,
        Url: myUrl.href,
      })
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

      if (!validFileName(newFileName)) {
        return res.sendStatus(400)
      }

      if (overwrite || !exists) {
        const success = await updateFile(filePath, req.rawBody, false)
        res.status(success ? 200 : 409)
      } else {
        if (isLocked) {
          res.setHeader('X-WOPI-Lock', fileInfo.lock[newFileName] || '')
        }
        res.status(409)
      }

      const myUrl = new URL(`${WOPI_SERVER}/wopi/files/${newFileName}`)
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
