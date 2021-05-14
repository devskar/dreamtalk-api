import { protectedDreamerRouteHandler } from './../utils/handler';
import * as controller from '../controller/dreams';
import * as commentController from '../controller/comments';
import express from 'express';

const router = express.Router();

router.get('/', controller.getAll);

router.get('/:id', controller.getById);

router.put('/:id', protectedDreamerRouteHandler, controller.edit);

router.post('/create', protectedDreamerRouteHandler, controller.create);

router.delete('/:id', protectedDreamerRouteHandler, controller.remove);

router.get('/:id/comments', commentController.getDreamComments);

router.post(
  '/:id/comments',
  protectedDreamerRouteHandler,
  commentController.postDreamComment
);

export default router;
