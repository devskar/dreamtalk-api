import { DreamerPermissionLevel } from './../entity/Dreamer';
import { IncomingHttpHeaders } from 'node:http';
import jwt from 'jsonwebtoken';
import { JWTMAXTIME as JWTEXPIRETIME, JWTSECRET } from '../static/const';

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
  if (!cookies) return null;

  return (
    cookies
      .split(';')
      .map((c) => c.trim())
      .filter((cookie) => {
        return cookie.substring(0, cookieName.length + 1) === `${cookieName}=`;
      })
      .map((cookie) => {
        return decodeURIComponent(cookie.substring(cookieName.length + 1));
      })[0] || null
  );
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
