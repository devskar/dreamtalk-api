import { DREAM_AMOUNT_DEFAULT } from './../static/const';
import { DREAM_CREATE_SCHEMA, GET_AMOUNT_SCHEMA } from './../static/schemas';
import Dreamer from './../entity/Dreamer';
import { ErrorWithStatus, getCookie, getUserIdFromJWT } from './../utils/utils';
import express from 'express';
import Dream from '../entity/Dream';
import { JWTCOOKIENAME } from '../static/const';
import {
  sendJoiErrorResponse,
  sendUserNotFoundErrorResponse,
} from '../static/responses';
import { RSA_NO_PADDING } from 'node:constants';
import Joi from 'joi';

export const create = (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const { error, value } = DREAM_CREATE_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  // IF ANYTHING IS INVALID
  if (error) return sendJoiErrorResponse(error, next);

  const { title, content } = req.body;

  const token = getCookie(JWTCOOKIENAME, req.cookies);

  const author_id = getUserIdFromJWT(token);

  Dreamer.findOne({ where: { id: author_id } }).then((author) => {
    if (!author) return sendUserNotFoundErrorResponse(next);

    const dream = Dream.create({
      author: author,
      title: title,
      content: content,
    });

    dream.save().then((savedDream) => {
      res.status(200).json(savedDream.id);
    });
  });
};

export const get = (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  var { value } = GET_AMOUNT_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (!value.amount) value.amount = DREAM_AMOUNT_DEFAULT;

  const amount: number = +value.amount;

  Dream.createQueryBuilder('dream')
    .leftJoinAndSelect('dream.author', 'dreamer')
    .take(amount)
    .getMany()
    .then((dreams) => {
      res.status(200).json(dreams);
    });
};
