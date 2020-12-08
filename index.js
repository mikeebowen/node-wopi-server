'use strict'

const { join } = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()
const { getDiscoveryInfo, getFile, checkFileInfo, lock, putFile } = require('./middleware')
const port = process.env.PORT || 3000

// app.get('*', getDiscoveryInfo)
router.route('/files/:file_id/contents').get(getFile).post(putFile)
router.route('/files/:file_id').get(checkFileInfo).post(lock)

app.use(bodyParser.raw())
app.use('/wopi', router)
app.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, 'SampleHostPage.html'))
})
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
