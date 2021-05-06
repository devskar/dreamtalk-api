import Dream from './../entity/Dream';
import * as controller from '../controller/dreams';
import express from 'express';
const router = express.Router();

router.get('/', (req, res, next) => {
  Dream.find().then((dreams) => {
    res.status(200).json(dreams);
  });
});

router.post('/', (req, res, next) => {});

export default router;
