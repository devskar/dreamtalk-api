import {
  ErrorWithStatus,
  getDreamerIdFromJWT,
  getJWTToken,
} from '../utils/utils';
import express from 'express';
import Dream from '../entity/Dream';
import {
  sendDreamNotFoundErrorResponse,
  sendJoiErrorResponse,
  sendNotSignedInErrorResponse,
} from '../static/responses';
import Dreamer from '../entity/Dreamer';
import { COMMENT_POST_SCHEMA } from '../static/schemas';
import Comment from '../entity/Comment';

export const getDreamComments = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const dream_id = req.params.id;

  const dream = await Dream.createQueryBuilder('dream')
    .where({ id: dream_id })
    .leftJoinAndSelect('dream.comments', 'comments')
    .getOne();

  if (!dream) return sendDreamNotFoundErrorResponse(next);

  res.status(200).json(dream.comments);
};

export const postDreamComment = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const dreamer_id = getDreamerIdFromJWT(getJWTToken(req));

  const dreamer = await Dreamer.createQueryBuilder()
    .where({ id: dreamer_id })
    .getOne();

  if (!dreamer) return sendNotSignedInErrorResponse(next);

  const dream_id = req.params.id;

  const dream = await Dream.createQueryBuilder('dream')
    .where({ id: dream_id })
    .getOne();

  if (!dream) return sendDreamNotFoundErrorResponse(next);

  const { error, value } = COMMENT_POST_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  // IF ANYTHING IS INVALID
  if (error) return sendJoiErrorResponse(error, next);

  const { content } = value;

  const comment = Comment.create({
    content: content,
    author: dreamer,
    dream: dream,
  });

  await comment.save();

  res.status(200).json({ message: 'Successfully added comment.', comment });
};
