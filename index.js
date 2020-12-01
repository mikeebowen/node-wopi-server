'use strict'
const { join, resolve } = require('path')
const { userInfo } = require('os')
const { stat, existsSync, readFile } = require('fs')
const express = require('express')
const app = express()
const router = express.Router()
const { localStoragePath } = require('./config.json')
const { promisify } = require('util')
const statPromise = promisify(stat)
const readFilePromise = promisify(readFile)

router.route('/files/:file_id/contents').get(async (req, res, next) => {
  try {
    const filePath = join(...localStoragePath, req.params.file_id)
    if (existsSync(filePath)) {
      const file = await readFilePromise(filePath)
      res.status(200)
      res.send(file.toString('binary'))
    } else {
      res.status(404)
      res.send('not found')
    }
  } catch (err) {
    console.error(err.message || err)
  }
})
router
  .route('/files/:file_id')
  // check file info
  .get(async (req, res, next) => {
    try {
      const filePath = join(...localStoragePath, req.params.file_id)
      if (existsSync(filePath)) {
        const fileStats = await statPromise(filePath)
        const fileInfoResponse = {
          BaseFileName: req.params.file_id,
          OwnerId: 'documentOwnerId',
          UserId: userInfo().username,
          Version: fileStats.ino.toString(),
          Size: fileStats.size,
          // These are optional:
          // BreadcrumbBrandName: 'LocalStorage WOPI Host',
          // BreadcrumbBrandUrl: 'http://localhost',
          // BreadcrumbFolderName: 'WopiStorage',
          // BreadcrumbFolderUrl: 'http://localhost',
          // BreadcrumbDocName: 'test',
          // UserCanWrite: true,
          // ReadOnly: false,
          // SupportsLocks: true,
          // SupportsUpdate: true,
          // UserCanNotWriteRelative: true,
          // UserFriendlyName: 'A WOPI User',
          // CloseUrl: 'https://google.com',
          // ClientUrl:
          //   'https://microsoft-my.sharepoint.com/:w:/r/personal/mibowe_microsoft_com/_layouts/15/Doc.aspx?sourcedoc=%7B55C14245-7FA9-40E1-9695-9C8E5E3D364C%7D&file=test.docx&action=default&mobileredirect=true',
        }
        res.status(200).json(fileInfoResponse)
      } else {
        res.status(404).send('file does not exist')
      }
    } catch (err) {
      console.error(err.message || err)
    }
  })

app.use('/wopi', router)
app.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, 'SampleHostPage.html'))
})
app.listen(3000, () => {
  console.log('server running on port 3000')
})
