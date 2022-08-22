import { Router } from 'express';
import { copyFile, createEmptyFile, getDiscoveryInfo, getFileNames } from '../middleware';

// eslint-disable-next-line new-cap
const router = Router();


router.post('/create/:file_id', createEmptyFile);
router.post('/add-file', copyFile);
router.get('/fileNames', getFileNames);
router.get('/discovery', getDiscoveryInfo);

export default router;
