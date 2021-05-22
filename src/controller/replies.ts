import { DreamerPermissionLevel } from '../entity/Dreamer';
import {
  sendDreamNotFoundErrorResponse,
  sendNotSignedInErrorResponse,
  sendCommentNotFoundErrorResponse,
  sendReplyNotFoundErrorResponse,
} from '../static/responses';
import {
  GET_UUID_SCHEMA,
  REPLY_POST_SCHEMA,
  REPLY_UPDATE_SCHEMA,
} from '../static/schemas';
import express from 'express';
import {
  ErrorWithStatus,
  getDreamerIdFromJWT,
  getJWTToken,
  isDreamerOrHasPermission,
} from '../utils/utils';
import {
  sendJoiErrorResponse,
  sendSomethingWentWrongErrorResponse,
  sendInsufficientPermissionErrorResponse,
} from '../static/responses';
import Comment from '../entity/Comment';
import Dreamer from '../entity/Dreamer';
import Reply from '../entity/Reply';

export const getCommentReplies = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const comment_id = req.params.id;

  const comment = await Comment.createQueryBuilder('comment')
    .where({ id: comment_id })
    .leftJoinAndSelect('comment.replies', 'replies')
    .getOne();

  if (!comment) return sendDreamNotFoundErrorResponse(next);

  res.status(200).json(comment.replies);
};

export const postCommentReply = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const dreamer_id = getDreamerIdFromJWT(getJWTToken(req));

  const dreamer = await Dreamer.createQueryBuilder()
    .where({ id: dreamer_id })
    .getOne();

  if (!dreamer) return sendNotSignedInErrorResponse(next);

  const comment_id = req.params.id;

  const comment = await Comment.createQueryBuilder()
    .where({ id: comment_id })
    .getOne();

  if (!comment) return sendDreamNotFoundErrorResponse(next);

  const { error, value } = REPLY_POST_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  // IF ANYTHING IS INVALID
  if (error) return sendJoiErrorResponse(error, next);

  const { content } = value;

  const reply = Reply.create({
    content: content,
    author: dreamer,
    parent: comment,
  });

  await reply.save();

  res.status(200).json({ message: 'Successfully added reply.', id: reply.id });
};

export const getAllReplies = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const replies = await Reply.createQueryBuilder('reply')
    .leftJoinAndSelect('reply.parent', 'comment')
    .leftJoinAndSelect('reply.author', 'dreamer')
    .leftJoinAndSelect('comment.dream', 'dream')
    .getMany();

  res.status(200).json(replies);
};

export const getReply = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const reply = await Reply.createQueryBuilder('reply')
    .where({ id: req.params.id })
    .leftJoinAndSelect('reply.author', 'dreamer')
    .leftJoinAndSelect('reply.parent', 'comment')
    .leftJoinAndSelect('comment.dream', 'dream')
    .getOne();

  if (!reply) return sendReplyNotFoundErrorResponse(next);

  res.status(200).json(reply);
};

export const editReply = async (
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

  const reply_id = req.params.id;

  const reply = await Reply.createQueryBuilder('reply')
    .where({ id: reply_id })
    .leftJoinAndSelect('reply.author', 'dreamer')
    .getOne();

  if (!reply) return sendReplyNotFoundErrorResponse(next);

  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      dreamer.id,
      reply.author.id
    )
  )
    return sendInsufficientPermissionErrorResponse(next);

  const { error, value } = REPLY_UPDATE_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (error) return sendJoiErrorResponse(error, next);

  // SETTING A NEW `dateEdited`
  value['dateEdited'] = new Date();

  // UPDATING THE REPLY
  const result = await Reply.createQueryBuilder()
    .update()
    .set(value)
    .where({ id: reply.id })
    .execute();

  // IF ERROR WHILE UPDATING OCCURS
  if (!result.affected) return sendSomethingWentWrongErrorResponse(next);

  // SEND RESPONSE IF EVERYTHING WENT RIGHT
  res.status(200).json({ message: 'Reply successfully updated.' });
};

export const deleteReply = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const validation = GET_UUID_SCHEMA.validate(req.params);

  if (validation.error) return sendJoiErrorResponse(validation.error, next);

  const reply = await Reply.createQueryBuilder('reply')
    .where({ id: req.params.id })
    .leftJoinAndSelect('reply.author', 'author')
    .getOne();

  // CHECK IF THE REPLY THAT SHOULD BE DELETED EXISTS
  if (!reply) return sendReplyNotFoundErrorResponse(next);

  const executiveDreamer = await Dreamer.createQueryBuilder()
    .where({ id: getDreamerIdFromJWT(getJWTToken(req)) })
    .getOne();

  // CHECK IF THE USER EXISTS (SHOULD NOT BE NECESSARY)
  if (!executiveDreamer) return sendNotSignedInErrorResponse(next);

  // CHECK IF THE USER IS ALLOWED TO DELETE THE REPLY
  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      executiveDreamer.id,
      reply.author.id
    )
  )
    return sendInsufficientPermissionErrorResponse(next);

  // DELETE THE REPLY
  reply.remove().then(() => {
    res.status(200).json({ message: `Successfully deleted reply.` });
  });
};
