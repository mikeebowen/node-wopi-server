'use strict'

module.exports = (req, res, next) => {
  const { access_token } = req.query
  const token = access_token || req.header('authorization')
  if (token && token.toLowerCase() !== 'invalid') {
    next()
  } else {
    return res.status(401).send('Invalid Token')
  }
}
