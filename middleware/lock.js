'use strict'

const { json } = require('body-parser')

let xWopiLock = {}
let status

module.exports = (req, res, next) => {
  const xWopiOverride = req.header('X-WOPI-Override')
  const lockValue = req.header('X-WOPI-Lock') && JSON.parse(req.header('X-WOPI-Lock'))
  if (!lockValue) {
    return res.sendStatus(400)
  }
  const header = xWopiOverride ? xWopiOverride.toUpperCase() : undefined
  const { file_id } = req.params
  if (xWopiOverride && (header === 'LOCK' || header === 'UNLOCK' || header === 'REFRESH_LOCK')) {
    // xWopiLock[file_id] = !Object.hasOwnProperty.call(xWopiLock, file_id) ? lockValue : xWopiLock[file_id]
    // if (xWopiLock[file_id].S === lockValue.S) {
    //   // res.setHeader('X-WOPI-Lock', '')
    //   res.sendStatus(200)
    // } else {
    //   res.setHeader('X-WOPI-Lock', xWopiLock[file_id])
    //   res.sendStatus(409)
    // }
    // switch (header) {
    //   case 'LOCK':

    //     break
    //     case 'UNLOCK':

    //       break
    //   default:
    //     break
    // }
    console.log('X-WOPI-OVERRIDE: ', header)
    res.sendStatus(200)
  }
}
