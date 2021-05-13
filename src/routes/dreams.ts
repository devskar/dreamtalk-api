import { protectedDreamerRouteHandler } from './../utils/handler';
import Dream from './../entity/Dream';
import * as controller from '../controller/dreams';
import express from 'express';
const router = express.Router();

router.get('/', controller.get);

router.post('/create', protectedDreamerRouteHandler, controller.create);

export default router;
