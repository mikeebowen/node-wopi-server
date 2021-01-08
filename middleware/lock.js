'use strict'

let xWopiLock = {}

module.exports = (req, res, next) => {
  const xWopiOverride = req.header('X-WOPI-Override')
  const lockValue = req.header('X-WOPI-Lock')
  if (!lockValue) {
    return res.sendStatus(400)
  }
  const header = xWopiOverride ? xWopiOverride.toUpperCase() : undefined
  const { file_id } = req.params
  if (!Object.hasOwnProperty.call(xWopiLock, file_id) || xWopiLock[file_id] === lockValue) {
    switch (header) {
      case 'LOCK':
        xWopiLock[file_id] = lockValue
        return res.sendStatus(200)
      case 'UNLOCK' || 'REFRESH_LOCK':
        if (!Object.hasOwnProperty.call(xWopiLock, file_id)) {
          res.setHeader('X-WOPI-Lock', '')
          return res.sendStatus(409)
        } else {
          delete xWopiLock[file_id]
          return res.sendStatus(200)
        }
      default:
        res.setHeader('X-WOPI-Lock', xWopiLock[file_id])
        return res.sendStatus(409)
    }
  } else {
    return res.sendStatus(400)
  }
}
