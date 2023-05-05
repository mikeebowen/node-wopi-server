import { Router } from 'express';
import { copyFile, createEmptyFile, getDiscoveryInfo, getFileNames } from '../middleware/appMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

// eslint-disable-next-line new-cap
const router = Router();


router.post('/create/:file_id', asyncHandler(createEmptyFile));
router.post('/add-file', asyncHandler(copyFile));
router.get('/fileNames', asyncHandler(getFileNames));
router.get('/discovery', asyncHandler(getDiscoveryInfo));

export default router;
