import { DreamerPermissionLevel } from './../entity/Dreamer';
import { JWTCOOKIENAME, JWTSECRET } from './../static/const';
import {
  ErrorWithStatus,
  getCookie,
  removeEmptyOrNull,
  createJWT,
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

export const corsHandler = (
  req: express.Request,
  res: express.Response,
  next: (_?: any) => void
) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.header('Access-Contorl-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }

  next();
};

export const jwtHandler = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  // GET THE JWT TOKEN FROM COOKIES OR NULL
  const token = getCookie(JWTCOOKIENAME, req.headers.cookie);

  // IF NO TOKEN EXISTS => GO TO NEXT STEP
  if (!token) return next();

  // DECODES THE OLD TOKEN
  jwt.verify(token, JWTSECRET, (err, decoded) => {
    //IF TOKEN IS EXPIRED RETURN
    if (err) return next();

    console.log(decoded);

    // CREATES NEW REFRESHED TOKEN
    const newToken = createJWT(decoded['id'], decoded['permissionLevel']);

    res.setHeader('Set-Cookie', `sessiontoken=${newToken}; HttpOnly`);

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

  const token = getCookie(JWTCOOKIENAME, req.headers.cookie);

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
