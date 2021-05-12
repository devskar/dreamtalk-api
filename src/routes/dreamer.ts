import {
  protectedUserRouteHandler,
  protectedStaffRouteHandler,
} from './../utils/handler';
import express, { response } from 'express';
import * as controller from '../controller/dreamer';

const router = express.Router();

// USER SIGNUP
router.post('/signup', controller.signup);

router.post('/login', controller.login);

router.post('/logout', protectedUserRouteHandler, controller.logout);

router.get('/', controller.getAll);

router.get('/:username', controller.getByUsername);

router.get('/:username/dreams/', controller.getDreamsByUsername);

router.put('/:username', protectedUserRouteHandler, controller.edit);

router.delete(
  '/:username',
  protectedUserRouteHandler,
  controller.deleteByUsername
);

export default router;
