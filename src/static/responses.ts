import Joi from 'joi';
import { ErrorWithStatus } from '../utils/utils';

export const sendNotSignedInErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('You are not signed in.') as ErrorWithStatus;
  err.status = 401;

  next(err);
};

export const sendInsufficientPermissionErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('Insufficient permission.') as ErrorWithStatus;
  err.status = 401;

  next(err);
};

export const sendJoiErrorResponse = (
  error: Joi.ValidationError,
  next: (error: ErrorWithStatus) => void
) => {
  const messages = error.details.map((x) => x.message);

  const err = new Error() as ErrorWithStatus;
  err.status = 400;
  err.messages = messages;

  next(err);
};

export const sendWrongCredentialsErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('Wrong login credentials.') as ErrorWithStatus;
  err.status = 403;

  next(err);
};

export const sendDreamerNotFoundErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('Dreamer not found.') as ErrorWithStatus;
  err.status = 403;
  next(err);
};

export const sendDreamNotFoundErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('Dream not found.') as ErrorWithStatus;
  err.status = 403;
  next(err);
};

export const sendCommentNotFoundErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('Comment not found.') as ErrorWithStatus;
  err.status = 403;
  next(err);
};

export const sendSomethingWentWrongErrorResponse = (
  next: (error: ErrorWithStatus) => void
) => {
  const err = new Error('Something went wrong.') as ErrorWithStatus;
  err.status = 500;
  next(err);
};
