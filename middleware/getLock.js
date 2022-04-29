'use strict'
const { fileInfo } = require('../utils')

module.exports = (req, res, next) => {
  const { file_id } = req.params
  // const lockValue = req.header('X-WOPI-Lock')

  if (!Object.hasOwnProperty.call(fileInfo.lock, file_id)) {
    res.setHeader('X-WOPI-Lock', '')
    return res.sendStatus(200)
  } else {
    res.setHeader('X-WOPI-Lock', fileInfo.lock[file_id] || '')
    return res.sendStatus(200)
  }
}
