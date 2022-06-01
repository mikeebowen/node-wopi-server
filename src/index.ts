'use strict';

require('dotenv').config();
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
const express = require('express');
const app = express();
const router = new express.Router();
const {
  getDiscoveryInfo,
  getFile,
  checkFileInfo,
  putFile,
  getRawBody,
  checkAccess,
  getFileNames,
  handleHeaders,
  createEmptyFile,
  copyFile,
} = require('./middleware');
const port = process.env.PORT || 3000;

// const key = readFileSync('./certificates/wopi-key.pem')
// const cert = readFileSync('./certificates/wopi-cert.pem')
// const pfx = readFileSync(join(__dirname, 'certificates', 'dev-cert.pfx'))
// const passphrase = 'p@ssw0rd'
// const secureProtocol = 'TLSv1_2_method'

app.use(getRawBody); // adds the raw binary of the post body to req.rawBody
// app.get('*', getDiscoveryInfo)
router.route('/files/:file_id/contents').get(getFile).post(putFile);
router.route('/files/:file_id').get(checkFileInfo).post(handleHeaders);

app.use('/wopi', checkAccess);
app.use('/wopi', router);
app.post('/create/:file_id', createEmptyFile);
app.post('/add-file', copyFile);
app.get('/fileNames', getFileNames);
app.get('/discovery', getDiscoveryInfo);
app.get('/', (req: Request, res: Response, next:NextFunction) => {
  // res.sendFile(join(__dirname, 'SampleHostPage.html'))
  res.sendFile(join(__dirname, 'index.html'));
});

// createServer({ pfx, passphrase, secureProtocol }, app).listen(port, () => {
//   console.log(`server running on port ${port}`)
// })
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on port ${port}`);
});
