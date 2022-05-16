'use strict'
const { join, extname } = require('path')
const { readdir } = require('fs/promises')
const { decode } = require('utf7')
const validFileName = require('valid-filename')
const { fileInfo, updateFile, getWopiMethods } = require('../utils')
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
      const folderPath = join(process.cwd(), 'files')
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
      const { actionUrl, hostViewUrl, hostEditUrl } = await getUrls(newFileName)

      return res.json({
        Name: newFileName,
        Url: actionUrl.href,
        HostEditUrl: hostEditUrl.href,
        HostViewUrl: hostViewUrl.href,
      })
    } catch (err) {
      console.error(err.message || err)
      return res.sendStatus(500)
    }
  } else {
    try {
      const fileName = isRelative.startsWith('.') ? fileInfo.info.BaseFileName + isRelative : isRelative
      const newFileName = decode(fileName)
      const folderPath = join(process.cwd(), 'files')
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
      const { actionUrl, hostViewUrl, hostEditUrl } = await getUrls(newFileName)

      return res.json({
        Name: newFileName,
        Url: actionUrl.href,
        HostEditUrl: hostEditUrl.href,
        HostViewUrl: hostViewUrl.href,
      })
    } catch (err) {
      console.error(err.message || err)
      return res.sendStatus(500)
    }
  }
}

const getUrls = async newFileName => {
  const actionUrl = new URL(`${WOPI_SERVER}/wopi/files/${newFileName}`)
  actionUrl.searchParams.append('access_token', 'myVerySecretToken')
  const urls = await getWopiMethods()
  const ext = extname(newFileName).replace('.', '')
  const viewActionUrl = Object.hasOwnProperty.call(urls, ext)
    ? urls[ext].filter(u => u[0] === 'view')[0][1]
    : urls.undefined.filter(u => u[0] === 'view')[0][1]
  const hostViewUrl = new URL(viewActionUrl)
  hostViewUrl.searchParams.append('embed', '1')
  hostViewUrl.searchParams.append('WOPISrc', actionUrl.href)

  const editActionUrl = Object.hasOwnProperty.call(urls, ext)
    ? urls[ext].filter(u => u[0] === 'edit')[0][1]
    : urls.undefined.filter(u => u[0] === 'edit')[0][1]
  const hostEditUrl = new URL(editActionUrl)
  hostEditUrl.searchParams.append('embed', '1')
  hostEditUrl.searchParams.append('WOPISrc', actionUrl.href)
  return { actionUrl, hostViewUrl, hostEditUrl }
}
