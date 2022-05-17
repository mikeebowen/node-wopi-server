'uses strict'
const { parse } = require('path')

const { join } = require('path')
const { stat, readdir } = require('fs/promises')
const { userInfo } = require('os')
const { fileInfo } = require('../utils/')
const { WOPI_SERVER } = process.env

module.exports = async (req, res, next) => {
  let fileStats
  const i = parseInt(req.params.file_id)
  const folderPath = join(process.cwd(), 'files')
  const fileName = isNaN(i) ? req.params.file_id : (await readdir(folderPath)).sort()[i]
  const filePath = join(folderPath, fileName)

  try {
    fileStats = await stat(filePath)
  } catch (err) {
    fileStats = {
      dev: 2114,
      ino: 48064969,
      mode: 33188,
      nlink: 1,
      uid: 85,
      gid: 100,
      rdev: 0,
      size: 527,
      blksize: 4096,
      blocks: 8,
      atimeMs: 1318289051000.1,
      mtimeMs: 1318289051000.1,
      ctimeMs: 1318289051000.1,
      birthtimeMs: 1318289051000.1,
      atime: new Date(),
      mtime: new Date(),
      ctime: new Date(),
      birthtime: new Date(),
    }
  }
  try {
    // res.send({
    //   BaseFileName: file_id,
    //   OwnerId: 'documentOwnerId',
    //   UserId: userInfo().username,
    //   Version: fileStats.ctimeMs.toString(),
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

    const info = {
      BaseFileName: fileName,
      OwnerId: userInfo().uid.toString(),
      // Size: 100,
      Size: fileStats.size,
      UserId: userInfo().username,
      UserFriendlyName: userInfo().username,
      // Version: new Date(fileStats.mtime).toISOString(),
      Version: fileStats.ctimeMs.toString(),
      // Version: 'foobar',
      SupportsLocks: true,
      SupportsGetLock: true,
      SupportsDeleteFile: true,
      // WebEditingDisabled: false,
      UserCanWrite: true,
      SupportsUpdate: true,
      // SupportsRename: true,
      SupportsRename: false,
      SupportsCobalt: false,
      // LastModifiedTime: new Date(),
      LastModifiedTime: new Date(fileStats.mtime).toISOString(),
      BreadcrumbBrandName: 'LocalStorage WOPI Host',
      BreadcrumbBrandUrl: WOPI_SERVER,
      BreadcrumbFolderName: 'WopiStorage',
      BreadcrumbFolderUrl: WOPI_SERVER,
      BreadcrumbDocName: fileName,
      ReadOnly: false,
      // UserCanNotWriteRelative: true,
      ClientUrl: filePath,
    }
    if (fileInfo.info.BaseFileName === fileName) {
      Object.keys(info).forEach(k => {
        if (!Object.hasOwnProperty.call(fileInfo.info, k)) {
          fileInfo.info[k] = info[k]
        }
      })
    } else {
      fileInfo.info = info
    }
    res.send(fileInfo.info)
  } catch (err) {
    console.error(err.message || err)
    return res.status(404)
  }
}
