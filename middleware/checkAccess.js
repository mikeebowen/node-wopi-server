'use strict'

module.exports = (req, res, next) => {
  const { access_token } = req.query
  if (access_token && access_token.toLowerCase() !== 'invalid') {
    next()
  } else {
    res.status(401).send('Invalid Token')
  }
}
