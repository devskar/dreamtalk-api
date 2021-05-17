import { sendCommentNotFoundErrorResponse } from './../static/responses';
import { COMMENT_UPDATE_SCHEMA, GET_UUID_SCHEMA } from './../static/schemas';
import {
  isDreamerOrHasPermission,
  ErrorWithStatus,
  getDreamerIdFromJWT,
  getJWTToken,
} from '../utils/utils';
import express from 'express';
import Dream from '../entity/Dream';
import {
  sendDreamNotFoundErrorResponse,
  sendInsufficientPermissionErrorResponse,
  sendJoiErrorResponse,
  sendNotSignedInErrorResponse,
  sendSomethingWentWrongErrorResponse,
} from '../static/responses';
import Dreamer, { DreamerPermissionLevel } from '../entity/Dreamer';
import { COMMENT_POST_SCHEMA } from '../static/schemas';
import Comment from '../entity/Comment';

export const getDreamComments = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

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

export const getAllComments = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const comments = await Comment.createQueryBuilder('comment')
    .leftJoinAndSelect('comment.dream', 'dream')
    .getMany();

  res.status(200).json(comments);
};

export const getComment = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const comment = await Comment.createQueryBuilder('comment')
    .where({ id: req.params.id })
    .leftJoinAndSelect('comment.author', 'dreamer')
    .leftJoinAndSelect('comment.dream', 'dream')
    .getOne();

  if (!comment) return sendCommentNotFoundErrorResponse(next);

  res.status(200).json(comment);
};

export const editComment = async (
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

  const comment_id = req.params.id;

  const comment = await Comment.createQueryBuilder('comment')
    .where({ id: comment_id })
    .leftJoinAndSelect('comment.author', 'dreamer')
    .getOne();

  if (!comment) return sendCommentNotFoundErrorResponse(next);

  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      dreamer.id,
      comment.author.id
    )
  )
    return sendCommentNotFoundErrorResponse(next);

  const { error, value } = COMMENT_UPDATE_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (error) return sendJoiErrorResponse(error, next);

  // SETTING A NEW `dateEdited`
  value['dateEdited'] = new Date();

  // UPDATING THE COMMENT
  const result = await Comment.createQueryBuilder()
    .update()
    .set(value)
    .where({ id: comment.id })
    .execute();

  // IF ERROR WHILE UPDATING OCCURS
  if (!result.affected) return sendSomethingWentWrongErrorResponse(next);

  // SEND RESPONSE IF EVERYTHING WENT RIGHT
  res.status(200).json({ message: 'Comment successfully updated.' });
};

export const deleteComment = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const comment = await Comment.createQueryBuilder('comment')
    .where({ id: req.params.id })
    .leftJoinAndSelect('comment.author', 'author')
    .getOne();

  // CHECK IF THE COMMENT THAT SHOULD BE DELETED EXISTS
  if (!comment) return sendCommentNotFoundErrorResponse(next);

  const executiveDreamer = await Dreamer.createQueryBuilder()
    .where({ id: getDreamerIdFromJWT(getJWTToken(req)) })
    .getOne();

  // CHECK IF THE USER EXISTS (SHOULD NOT BE NECESSARY)
  if (!executiveDreamer) return sendNotSignedInErrorResponse(next);

  // CHECK IF THE USER IS ALLOWED TO DELETE THE COMMENT
  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      executiveDreamer.id,
      comment.author.id
    )
  )
    return sendInsufficientPermissionErrorResponse(next);

  // DELETE THE COMMENT
  comment.remove().then(() => {
    res.status(200).json({ message: `Successfully deleted comment.` });
  });
};
