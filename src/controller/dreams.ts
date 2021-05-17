import {
  sendDreamNotFoundErrorResponse,
  sendInsufficientPermissionErrorResponse,
  sendSomethingWentWrongErrorResponse,
} from './../static/responses';
import { DREAM_AMOUNT_DEFAULT } from './../static/const';
import {
  DREAM_CREATE_SCHEMA,
  DREAM_UPDATE_SCHEMA,
  GET_AMOUNT_SCHEMA,
  GET_UUID_SCHEMA,
} from './../static/schemas';
import Dreamer, { DreamerPermissionLevel } from './../entity/Dreamer';
import {
  ErrorWithStatus,
  getJWTToken,
  getDreamerIdFromJWT as getDreamerIdFromJWT,
  isDreamerOrHasPermission as dreamerHasPermissionOrIs,
  isDreamerOrHasPermission,
} from './../utils/utils';
import express from 'express';
import Dream from '../entity/Dream';
import {
  sendJoiErrorResponse,
  sendDreamerNotFoundErrorResponse as sendDreamerNotFoundErrorResponse,
  sendNotSignedInErrorResponse,
} from '../static/responses';

export const create = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const dreamer_id = getDreamerIdFromJWT(getJWTToken(req));

  const dreamer = await Dreamer.createQueryBuilder()
    .where({ id: dreamer_id })
    .getOne();

  if (!dreamer) return sendNotSignedInErrorResponse(next);

  const { error, value } = DREAM_CREATE_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  // IF ANYTHING IS INVALID
  if (error) return sendJoiErrorResponse(error, next);

  const { title, content } = value;

  const dream = Dream.create({
    author: dreamer,
    title: title,
    content: content,
  });

  dream.save().then((savedDream) => {
    res
      .status(200)
      .json({ message: 'Successfully created dream.', id: savedDream.id });
  });
};

export const getAll = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  var { value } = GET_AMOUNT_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (!value.amount) value.amount = DREAM_AMOUNT_DEFAULT;

  const amount: number = +value.amount;

  const dreams = await Dream.createQueryBuilder('dream')
    .leftJoinAndSelect('dream.author', 'dreamer')
    .take(amount)
    .getMany();

  res.status(200).json(dreams);
};

export const getById = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const { error, value } = GET_UUID_SCHEMA.validate(req.params);

  if (error) return sendJoiErrorResponse(error, next);

  const id = req.params.id;

  const dream = await Dream.createQueryBuilder('dream')
    .where({ id: id })
    .leftJoinAndSelect('dream.author', 'dreamer')
    .getOne();

  if (!dream) return sendDreamNotFoundErrorResponse(next);

  res.status(200).json(dream);
};

export const edit = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const dreamer_id = getDreamerIdFromJWT(getJWTToken(req));

  const dreamer = await Dreamer.createQueryBuilder()
    .where({ id: dreamer_id })
    .getOne();

  if (!dreamer) return sendNotSignedInErrorResponse(next);

  const dream_id = req.params.id;

  const dream = await Dream.createQueryBuilder('dream')
    .where({ id: dream_id })
    .leftJoinAndSelect('dream.author', 'dreamer')
    .getOne();

  if (!dream) return sendDreamNotFoundErrorResponse(next);

  if (
    !dreamerHasPermissionOrIs(
      DreamerPermissionLevel.Staff,
      getDreamerIdFromJWT(getJWTToken(req))
    )
  )
    return sendInsufficientPermissionErrorResponse(next);

  const { error, value } = DREAM_UPDATE_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (error) return sendJoiErrorResponse(error, next);

  // SETTING A NEW `dateEdited`
  value['dateEdited'] = new Date();

  // UPDATING THE DREAM
  const result = await Dream.createQueryBuilder()
    .update()
    .set(value)
    .where({ id: dream.id })
    .execute();

  // IF ERROR WHILE UPDATING OCCURS
  if (!result.affected) return sendSomethingWentWrongErrorResponse(next);

  // SEND RESPONSE IF EVERYTHING WENT RIGHT
  res.status(200).json({ message: 'Dream successfully updated.' });
};

export const remove = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const dreamer_id = getDreamerIdFromJWT(getJWTToken(req));

  const dreamer = await Dreamer.createQueryBuilder()
    .where({ id: dreamer_id })
    .getOne();

  if (!dreamer) return sendNotSignedInErrorResponse(next);

  const dream_id = req.params.id;

  const dream = await Dream.createQueryBuilder('dream')
    .where({ id: dream_id })
    .leftJoinAndSelect('dream.author', 'dreamer')
    .getOne();

  if (!dream) return sendDreamNotFoundErrorResponse(next);

  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      dreamer.id,
      dream.author.id
    )
  )
    return sendDreamNotFoundErrorResponse(next);

  dream.remove().then(() => {
    res.status(200).json({ message: 'Successfully deleted dream.' });
  });
};
