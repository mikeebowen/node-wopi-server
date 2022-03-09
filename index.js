'use strict'

require('dotenv').config()
const { join } = require('path')
const express = require('express')
const app = express()
const router = express.Router()
const { getDiscoveryInfo, getFile, checkFileInfo, putFile, getRawBody, checkAccess, getFileNames, handleHeaders } = require('./middleware')
const { createServer } = require('https')
const { readFileSync } = require('fs')
const port = process.env.PORT || 3000

// const key = readFileSync('./certificates/wopi-key.pem')
// const cert = readFileSync('./certificates/wopi-cert.pem')
// const pfx = readFileSync(join(__dirname, 'certificates', 'dev-cert.pfx'))
// const passphrase = 'p@ssw0rd'
// const secureProtocol = 'TLSv1_2_method'

app.use(getRawBody) // adds the raw binary of the post body to req.rawBody
// app.get('*', getDiscoveryInfo)
router.route('/files/:file_id/contents').get(getFile).post(putFile)
router.route('/files/:file_id').get(checkFileInfo).post(handleHeaders)
app.use('/wopi', checkAccess)
app.use('/wopi', router)
app.get('/fileNames', getFileNames)
app.get('/discovery', getDiscoveryInfo)
app.get('/', (req, res, next) => {
  // res.sendFile(join(__dirname, 'SampleHostPage.html'))
  res.sendFile(join(__dirname, 'index.html'))
})

// createServer({ pfx, passphrase, secureProtocol }, app).listen(port, () => {
//   console.log(`server running on port ${port}`)
// })
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
