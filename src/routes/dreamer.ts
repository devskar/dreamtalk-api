import {
  protectedUserRouteHandler,
  protectedStaffRouteHandler,
} from './../utils/handler';
import express, { response } from 'express';
import * as controller from '../controller/dreamer';

const router = express.Router();

// USER SIGNUP
router.post('/signup', controller.signup);

router.get('/', controller.getAll);

router.get('/:username', protectedUserRouteHandler, controller.getByUsername);

router.put('/:id', (req, res, next) => {});

router.delete(
  '/:username',
  protectedStaffRouteHandler,
  controller.deleteByUsername
);

export default router;
