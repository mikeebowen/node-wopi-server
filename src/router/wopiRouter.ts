import { NextFunction, Request, Response, Router } from 'express';
import { checkFileInfo, getFile, handleHeaders, putFile } from '../middleware/wopiMiddleware';

// eslint-disable-next-line new-cap
const router = Router();

router.route('/files/:file_id/contents').get(getFile).post(putFile);
router.route('/files/:file_id').get(checkFileInfo).post(handleHeaders);
router.route('/containers').all((req: Request, res: Response, next: NextFunction) => res.sendStatus(501));
router.route('/ecosystem').all((req: Request, res: Response, next: NextFunction) => res.sendStatus(501));

export default router;
