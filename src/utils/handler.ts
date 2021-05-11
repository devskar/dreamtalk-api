import {
  sendNotSignedInErrorResponse,
  sendInsufficientPermissionErrorResponse,
} from './../static/responses';
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
      return next();
    }
    // CREATES NEW REFRESHED TOKEN
    const newToken = createJWT(decoded['id'], decoded['permissionLevel']);

    setJWTHeader(res, newToken);

    next();
  });
};

const protectedRouteHandler = (
  requiredPermissionLevel: DreamerPermissionLevel,
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  const token = getCookie(JWTCOOKIENAME, req.cookies);

  if (!token) return sendNotSignedInErrorResponse(next);

  jwt.verify(token, JWTSECRET, (err, decoded) => {
    if (err) return sendNotSignedInErrorResponse(next);

    if (decoded['permissionLevel'] < requiredPermissionLevel)
      return sendInsufficientPermissionErrorResponse(next);

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
