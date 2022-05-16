'use strict'

const { fileInfo } = require('../utils')

module.exports = (req, res, next) => {
  const lockValue = req.header('X-WOPI-Lock')
  const oldLockValue = req.header('X-WOPI-OldLock')

  if (!lockValue) {
    return res.sendStatus(400)
  }

  const { file_id } = req.params

  if (
    !Object.hasOwnProperty.call(fileInfo.lock, file_id) ||
    fileInfo.lock[file_id] === lockValue ||
    fileInfo.lock[file_id] === oldLockValue
  ) {
    fileInfo.lock[file_id] = lockValue
    if (fileInfo.info.Version) {
      res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version)
    }

    return res.sendStatus(200)
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')

    return res.sendStatus(409)
  }
}
