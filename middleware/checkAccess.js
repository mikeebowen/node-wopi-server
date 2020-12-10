'use strict'

module.exports = (req, res, next) => {
  const { access_token } = req.query
  if (access_token && access_token.toLowerCase() !== 'invalid') {
    console.log('🚀 ~ file: checkAccess.js ~ line 6 ~ access_token', access_token)
    next()
  } else {
    res.status(401).send('Invalid Token')
  }
}
