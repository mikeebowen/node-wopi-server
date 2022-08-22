import { Router } from 'express';
import { checkFileInfo, getFile, handleHeaders, putFile } from '../middleware';

// eslint-disable-next-line new-cap
const router = Router();

router.route('/files/:file_id/contents').get(getFile).post(putFile);
router.route('/files/:file_id').get(checkFileInfo).post(handleHeaders);

export default router;
