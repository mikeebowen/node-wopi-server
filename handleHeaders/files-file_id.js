'use strict'
const { lock, refreshLock, unlock, getLock, putRelativeFile } = require('../middleware')
const { fileInfo } = require('../utils')
module.exports = (req, res, next) => {
  const operation = req.header('X-WOPI-Override')
  const { file_id } = req.params

  switch (operation) {
    case 'LOCK':
      lock(req, res, next)
      break
    case 'UNLOCK':
      unlock(req, res, next)
      break
    case 'REFRESH_LOCK':
      refreshLock(req, res, next)
      break
    case 'GET_LOCK':
      getLock(req, res, next)
      break
    case 'PUT_RELATIVE':
      // putRelativeFile(req, res, next)
      res.sendStatus(501)
      break
    default:
      res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
      res.sendStatus(409)
      break
  }
}
