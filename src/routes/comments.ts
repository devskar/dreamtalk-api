import express from 'express';
import * as controller from '../controller/comments';
import { protectedDreamerRouteHandler } from '../utils/handler';
import * as replyController from '../controller/replies';

const router = express.Router();

router.get('/', controller.getAllComments);

router.get('/:id', controller.getComment);

router.put('/:id', protectedDreamerRouteHandler, controller.editComment);

router.delete('/:id', protectedDreamerRouteHandler, controller.deleteComment);

router.get('/:id/replies', replyController.getCommentReplies);

router.post(
  '/:id/comments',
  protectedDreamerRouteHandler,
  replyController.postCommentReply
);

export default router;
