'use strict'

const { join } = require('path')
const express = require('express')
const app = express()
const router = express.Router()
const { getDiscoveryInfo, getFile, checkFileInfo, putFile, getRawBody, checkAccess } = require('./middleware')
const { filesFile_id } = require('./handleHeaders')
const port = process.env.PORT || 3000

app.use(getRawBody) // adds the raw binary of the post body to req.rawBody
// app.get('*', getDiscoveryInfo)
router.route('/files/:file_id/contents').get(getFile).post(putFile)
router.route('/files/:file_id').get(checkFileInfo).post(filesFile_id)
app.use('/wopi', checkAccess)
app.use('/wopi', router)
app.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, 'SampleHostPage.html'))
})
app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
