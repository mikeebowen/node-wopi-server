'use strict'

const fileInfo = require('./fileInfo')

module.exports = (req, res, next) => {
  const xWopiOverride = req.header('X-WOPI-Override')
  const lockValue = req.header('X-WOPI-Lock')
  const oldLockValue = req.header('X-WOPI-OldLock')

  if (!lockValue) {
    return res.sendStatus(400)
  }
  const header = xWopiOverride ? xWopiOverride.toLowerCase() : undefined
  const { file_id } = req.params
  switch (header) {
    case 'lock':
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
    case 'unlock':
      if (!Object.hasOwnProperty.call(fileInfo.lock, file_id) || fileInfo.lock[file_id] !== lockValue) {
        res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
        return res.sendStatus(409)
      } else {
        delete fileInfo.lock[file_id]
        res.setHeader('X-WOPI-ItemVersion', '')
        return res.sendStatus(200)
      }
    case 'refresh_lock':
      if (fileInfo.lock[file_id] === lockValue) {
        if (fileInfo.info.Version) {
          res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version)
        }
        return res.sendStatus(200)
      } else {
        res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
        return res.sendStatus(409)
      }
    default:
      res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
      return res.sendStatus(409)
  }
}
