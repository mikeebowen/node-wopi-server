'uses strict'
const { parse } = require('path')

const { join } = require('path')
const { existsSync, stat } = require('fs')
const { userInfo } = require('os')
const { promisify } = require('util')
const statPromise = promisify(stat)
const { wopiStorageFolder } = require('../config')
const fileInfo = require('./fileInfo')

module.exports = async (req, res, next) => {
  try {
    const filePath = join(parse(process.cwd()).root, wopiStorageFolder, req.params.file_id)
    if (existsSync(filePath)) {
      const fileStats = await statPromise(filePath)
      // res.send({
      //   BaseFileName: req.params.file_id,
      //   OwnerId: 'documentOwnerId',
      //   UserId: userInfo().username,
      //   Version: fileStats.ino.toString(),
      //   Size: fileStats.size,
      //   UserFriendlyName: 'Contoso User',
      //   SupportsLocks: true,
      //   WebEditingDisabled: false,
      //   UserCanWrite: true,
      //   SupportsUpdate: true,
      //   SupportsCobalt: false,
      //   LastModifiedTime: new Date().toISOString(),
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
      // })
      // res.status(200).json(fileInfoResponse)
      fileInfo.info = {
        BaseFileName: req.params.file_id,
        OwnerId: userInfo().uid.toString(),
        Size: fileStats.size,
        UserId: userInfo().username,
        UserFriendlyName: userInfo().username,
        Version: fileStats.ino.toString(),
        SupportsLocks: true,
        // WebEditingDisabled: false,
        UserCanWrite: true,
        SupportsUpdate: true,
        SupportsCobalt: false,
        // LastModifiedTime: new Date(fileStats.ctimeMs).toISOString(),
        LastModifiedTime: new Date().toISOString(),
        BreadcrumbBrandName: 'LocalStorage WOPI Host',
        BreadcrumbBrandUrl: 'http://localhost:3000',
        BreadcrumbFolderName: 'WopiStorage',
        BreadcrumbFolderUrl: 'http://localhost:3000',
        BreadcrumbDocName: 'test',
        ReadOnly: false,
        UserCanNotWriteRelative: true,
      }
      res.send(fileInfo.info)
    } else {
      res.status(404).send('file does not exist')
    }
  } catch (err) {
    console.error(err.message || err)
  }
}
