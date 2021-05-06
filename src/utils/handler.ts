import { DreamerPermissionLevel } from './../entity/Dreamer';
import { JWTCOOKIENAME, JWTSECRET } from './../static/const';
import {
  ErrorWithStatus,
  getCookie,
  removeEmptyOrNull,
  createJWT,
  setJWTHeader,
  resetJWTHeader,
} from './utils';
import express from 'express';
import jwt from 'jsonwebtoken';

// HANDLER
export const errorHandler = (
  err: ErrorWithStatus,
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  res.status(err.status || 500).json(
    removeEmptyOrNull({
      error: {
        message: err.message,
        messages: err.messages,
      },
    })
  );
};

export const noEndpointFoundHandler = (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const err = new Error('This endpoint does not exist.') as ErrorWithStatus;
  err.status = 404;

  next(err);
};

export const jwtHandler = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  // GET THE JWT TOKEN FROM COOKIES OR NULL
  const token = getCookie(JWTCOOKIENAME, req.cookies);

  // IF NO TOKEN EXISTS => GO TO NEXT STEP
  if (!token) return next();

  // DECODES THE OLD TOKEN
  jwt.verify(token, JWTSECRET, (err, decoded) => {
    //IF TOKEN IS EXPIRED RETURN
    if (err) {
      resetJWTHeader(res);
      console.log(err);
      return next();
    }
    console.log(decoded);

    // CREATES NEW REFRESHED TOKEN
    const newToken = createJWT(decoded['id'], decoded['permissionLevel']);

    setJWTHeader(res, newToken);

    next();
  });
};

export const protectedRouteHandler = (
  requiredPermissionLevel: DreamerPermissionLevel,
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  const sendNotSignedInError = () => {
    const err = new Error('You are not signed in.') as ErrorWithStatus;
    err.status = 401;

    errorHandler(err, req, res, next);
  };

  const sendInsufficientPermissionError = () => {
    const err = new Error('Insufficient permission.') as ErrorWithStatus;
    err.status = 401;

    errorHandler(err, req, res, next);
  };

  const token = getCookie(JWTCOOKIENAME, req.cookies);

  if (!token) return sendNotSignedInError();

  jwt.verify(token, JWTSECRET, (err, decoded) => {
    if (err) return sendNotSignedInError();

    if (decoded['permissionLevel'] < requiredPermissionLevel)
      return sendInsufficientPermissionError();

    next();
  });
};

export const protectedUserRouteHandler = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  protectedRouteHandler(DreamerPermissionLevel.User, req, res, next);
};

export const protectedStaffRouteHandler = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  protectedRouteHandler(DreamerPermissionLevel.Staff, req, res, next);
};
