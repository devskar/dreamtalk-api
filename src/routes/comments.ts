import express from 'express';
import * as controller from '../controller/comments';
import { protectedDreamerRouteHandler } from '../utils/handler';

const router = express.Router();

router.get('/', controller.getAllComments);

router.get('/:id', controller.getComment);

router.put('/:id', protectedDreamerRouteHandler, controller.editComment);

router.delete('/:id', protectedDreamerRouteHandler, controller.deleteComment);

export default router;
