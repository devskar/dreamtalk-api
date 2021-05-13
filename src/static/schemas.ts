import Joi from 'joi';
import {
  DREAMER_NICKNAME_MAX_LENGTH,
  DREAMER_NICKNAME_MIN_LENGTH,
  DREAMER_PASSWORD_MIN_LENGTH,
  DREAMER_USERNAME_MAX_LENGTH,
  DREAMER_USERNAME_MIN_LENGTH,
  DREAMER_PASSWORD_MAX_LENGTH,
  DREAM_TITLE_MIN_LENGTH,
  DREAM_TITLE_MAX_LENGTH,
  DREAM_CONTENT_MIN_LENGTH,
  DREAM_CONTENT_MAX_LENGTH,
} from './const';

// RULES
const dreamer_username = Joi.string()
  .alphanum()
  .min(DREAMER_USERNAME_MIN_LENGTH)
  .max(DREAMER_USERNAME_MAX_LENGTH);
const dreamer_nickname = Joi.string()
  .alphanum()
  .min(DREAMER_NICKNAME_MIN_LENGTH)
  .max(DREAMER_NICKNAME_MAX_LENGTH);
const dreamer_email = Joi.string().email();
const dreamer_password = Joi.string()
  .alphanum()
  .min(DREAMER_PASSWORD_MIN_LENGTH)
  .max(DREAMER_PASSWORD_MAX_LENGTH);

const dream_title = Joi.string()
  .min(DREAM_TITLE_MIN_LENGTH)
  .max(DREAM_TITLE_MAX_LENGTH);
const dream_content = Joi.string()
  .min(DREAM_CONTENT_MIN_LENGTH)
  .max(DREAM_CONTENT_MAX_LENGTH);

// SCHEMAS
export const DREAMER_SIGNUP_SCHEMA = Joi.object({
  username: dreamer_username.required(),
  email: dreamer_email.required(),
  password: dreamer_password.required(),
});

export const DREAMER_LOGIN_SCHEMA = Joi.object({
  username: dreamer_username,
  email: dreamer_email,
  password: dreamer_password.required(),
}).or('username', 'email');

export const DREAM_CREATE_SCHEMA = Joi.object({
  title: dream_title.required(),
  content: dream_content.required(),
});

export const DREAMER_UPDATE_SCHEMA = Joi.object({
  username: dreamer_username,
  nickname: dreamer_nickname,
  email: dreamer_email,
  password: dreamer_password,
}).or('username', 'nickname', 'email', 'password');

export const GET_AMOUNT_SCHEMA = Joi.object({
  amount: Joi.string().regex(/^\d+$/),
});
