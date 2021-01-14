'use strict'
const { lock, refreshLock, unlock, getLock } = require('../middleware')
const { fileInfo } = require('../utils')
module.exports = (req, res, next) => {
  const isPutRelative = req.header('X-WOPI-Override')
  const lockValue = req.header('X-WOPI-Override')
  const { file_id } = req.params

  if (isPutRelative === 'PUT_RELATIVE') {
    return res.sendStatus(501)
  }
  if (lockValue) {
    switch (lockValue) {
      case 'LOCK':
        return lock(req, res, next)
      case 'UNLOCK':
        return unlock(req, res, next)
      case 'REFRESH_LOCK':
        return refreshLock(req, res, next)
      case 'GET_LOCK':
        return getLock(req, res, next)
      default:
        res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
        return res.sendStatus(409)
    }
  }
}
