import {
  sendNotSignedInErrorResponse,
  sendInsufficientPermissionErrorResponse,
} from './../static/responses';
import Dreamer, { DreamerPermissionLevel } from './../entity/Dreamer';
import { JWTCOOKIENAME, JWTSECRET } from './../static/const';
import {
  ErrorWithStatus,
  getCookie,
  removeEmptyOrNull,
  createJWT,
  setJWTHeader,
  resetJWTHeader,
  getJWTToken,
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

const protectedRouteHandler = async (
  requiredPermissionLevel: DreamerPermissionLevel,
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  // GETTING THE TOKEN FRO COOKIES
  const token = getJWTToken(req);

  // IF IT DOES NOT EXIST => RETURN
  if (!token) return sendNotSignedInErrorResponse(next);

  try {
    // DECODING THE TOKEN
    const decoded = jwt.verify(token, JWTSECRET);

    // GETTING THE DREAMER
    const dreamer = await Dreamer.createQueryBuilder()
      .where({ id: decoded['id'] })
      .getOne();

    // IF IT DOES NOT EXIST => RETURN
    if (!dreamer) return sendNotSignedInErrorResponse(next);

    // IF PERMISSION LEVEL IS TOO LOW TO ACCESS THIS ROUTE => RETURN
    if (dreamer.permissionLevel < requiredPermissionLevel)
      return sendInsufficientPermissionErrorResponse(next);

    next();
  } catch {
    // IF DECODING FAILS => RETURN
    return sendNotSignedInErrorResponse(next);
  }
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
