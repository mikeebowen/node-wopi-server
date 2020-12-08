'use strict'

module.exports = (req, res, next) => {
  const xWopiOverride = req.header('X-WOPI-Override')
  const header = xWopiOverride ? xWopiOverride.toUpperCase() : undefined
  if (xWopiOverride && (header === 'LOCK' || header === 'UNLOCK' || header === 'REFRESH_LOCK')) {
    console.log('X-WOPI-OVERRIDE: ', header)
    res.sendStatus(200)
  }
}
