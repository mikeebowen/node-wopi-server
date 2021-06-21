'use strict'

require('dotenv').config()
const { join } = require('path')
const express = require('express')
const app = express()
const router = express.Router()
const { getDiscoveryInfo, getFile, checkFileInfo, putFile, getRawBody, checkAccess, getFileNames, handleHeaders } = require('./middleware')
const port = process.env.PORT || 3000

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
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
