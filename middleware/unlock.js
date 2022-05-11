'use strict'

const fileInfo = require('../utils/fileInfo')

module.exports = (req, res, next) => {
  const lockValue = req.header('X-WOPI-Lock')

  if (!lockValue) {
    return res.sendStatus(400)
  }

  const { file_id } = req.params

  if (!Object.hasOwnProperty.call(fileInfo.lock, file_id) || fileInfo.lock[file_id] !== lockValue) {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(409)
  } else {
    delete fileInfo.lock[file_id]
    if (fileInfo.info.Version) {
      res.setHeader('X-WOPI-ItemVersion', fileInfo.info.Version)
    }
    return res.sendStatus(200)
  }
}
