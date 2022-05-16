'use strict'

module.exports = {
  checkFileInfo: require('./checkFileInfo'),
  getDiscoveryInfo: require('./getDiscoveryInfo'),
  getFile: require('./getFile'),
  putFile: require('./putFile'),
  putRelativeFile: require('./putRelativeFile'),
  getRawBody: require('./getRawBody'),
  checkAccess: require('./checkAccess'),
  lock: require('./lock'),
  unlock: require('./unlock'),
  refreshLock: require('./refreshLock'),
  getLock: require('./getLock'),
  deleteFile: require('./deleteFile'),
  getFileNames: require('./getFileNames'),
  handleHeaders: require('./handleHeaders'),
  createEmptyFile: require('./createEmptyFile'),
  copyFile: require('./copyFile'),
}
