import express from 'express';
import * as controller from '../controller/replies';
import { protectedDreamerRouteHandler } from '../utils/handler';

const router = express.Router();

router.get('/', controller.getAllReplies);

router.get('/:id', controller.getReply);

router.put('/:id', protectedDreamerRouteHandler, controller.editReply);

router.delete('/:id', protectedDreamerRouteHandler, controller.deleteReply);

export default router;
