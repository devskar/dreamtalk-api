import { JWTCOOKIENAME, JWTMAXTIMEMINUTES } from './../static/const';
import { DreamerPermissionLevel } from './../entity/Dreamer';
import { IncomingHttpHeaders } from 'node:http';
import jwt from 'jsonwebtoken';
import { JWTMAXTIME as JWTEXPIRETIME, JWTSECRET } from '../static/const';
import Joi from 'joi';
import express from 'express';

export interface ErrorWithStatus extends Error {
  status?: number;
  messages?: string[];
}

export const removeEmptyOrNull = (obj: any) => {
  Object.keys(obj).forEach(
    (k) =>
      (obj[k] && typeof obj[k] === 'object' && removeEmptyOrNull(obj[k])) ||
      (!obj[k] && obj[k] !== undefined && delete obj[k])
  );

  return obj;
};

export const getCookie = (
  cookieName: string,
  cookies: IncomingHttpHeaders['cookie']
): string | null => {
  return cookies ? cookies[cookieName] : null;
};

export const createJWT = (
  dreamer_id: string,
  permissionLevel: DreamerPermissionLevel
) => {
  return jwt.sign(
    {
      id: dreamer_id,
      permissionLevel: permissionLevel,
    },
    JWTSECRET,
    { expiresIn: JWTEXPIRETIME }
  );
};

export const setJWTHeader = (res: express.Response, token: string) => {
  const date = new Date();
  date.setTime(date.getTime() + JWTMAXTIMEMINUTES * 60 * 1000);

  res.cookie(JWTCOOKIENAME, token, {
    httpOnly: true,
    expires: date,
  });
  console.log('[JWT] added cookie');
};

export const resetJWTHeader = (res: express.Response) => {
  res.clearCookie(JWTCOOKIENAME, {
    httpOnly: true,
  });
  console.log('[JWT] removed cookie');
};

export const getUserIdFromJWT = (token: string) => {
  return jwt.verify(token, JWTSECRET, (err, decoded) =>
    decoded ? decoded['id'] : null
  );
};
