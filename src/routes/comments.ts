import express from 'express';
import * as controller from '../controller/comments';

const router = express.Router();

router.get('/', controller.getAllComments);

router.get('/:id', controller.getComment);

export default router;
