'use strict'

const { join } = require('path')
const express = require('express')
const app = express()
const router = express.Router()
const { getDiscoveryInfo, getFile, checkFileInfo } = require('./middleware')
const port = process.env.PORT || 3000

// app.get('*', getDiscoveryInfo)
router.route('/files/:file_id/contents').get(getFile)
router.route('/files/:file_id').get(checkFileInfo)

app.use('/wopi', router)
app.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, 'SampleHostPage.html'))
})
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
