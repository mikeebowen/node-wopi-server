'use strict'
const { lock } = require('../utils')
module.exports = (req, res, next) => {
  const isPutRelative = req.header('X-WOPI-Override')

  if (isPutRelative === 'PUT_RELATIVE') {
    return res.sendStatus(501)
  }
  return lock(req, res, next)
}
