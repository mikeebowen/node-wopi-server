import { NextFunction, Request, Response, Router } from 'express';
import { checkFileInfo, getFile, handleHeaders, putFile } from '../middleware/wopiMiddleware';
import { asyncHandler } from '../utils';

// eslint-disable-next-line new-cap
const router = Router();

router.route('/files/:file_id/contents').get(asyncHandler(getFile)).post(asyncHandler(putFile));
router.route('/files/:file_id').get(asyncHandler(checkFileInfo)).post(asyncHandler(handleHeaders));
router.route('/containers/*').all((req: Request, res: Response, next: NextFunction) => res.sendStatus(501));
router.route('/ecosystem/*').all((req: Request, res: Response, next: NextFunction) => res.sendStatus(501));

export default router;
