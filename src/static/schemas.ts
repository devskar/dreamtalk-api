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
  COMMENT_CONTENT_MIN_LENGTH,
  COMMENT_CONTENT_MAX_LENGTH,
  REPLY_CONTENT_MIN_LENGTH,
  REPLY_CONTENT_MAX_LENGTH,
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

const comment_content = Joi.string()
  .min(COMMENT_CONTENT_MIN_LENGTH)
  .max(COMMENT_CONTENT_MAX_LENGTH);

const reply_content = Joi.string()
  .min(REPLY_CONTENT_MIN_LENGTH)
  .max(REPLY_CONTENT_MAX_LENGTH);

// SCHEMAS
// Dreamer
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

export const DREAMER_UPDATE_SCHEMA = Joi.object({
  username: dreamer_username,
  nickname: dreamer_nickname,
  email: dreamer_email,
  password: dreamer_password,
}).or('username', 'nickname', 'email', 'password');

//Dream
export const DREAM_CREATE_SCHEMA = Joi.object({
  title: dream_title.required(),
  content: dream_content.required(),
});

export const DREAM_UPDATE_SCHEMA = Joi.object({
  title: dream_title,
  content: dream_content,
}).or('title', 'content');

// Comment
export const COMMENT_POST_SCHEMA = Joi.object({
  content: comment_content.required(),
});
export const COMMENT_UPDATE_SCHEMA = Joi.object({
  content: comment_content.required(),
});

// Reply
export const REPLY_POST_SCHEMA = Joi.object({
  content: reply_content.required(),
});
export const REPLY_UPDATE_SCHEMA = Joi.object({
  content: reply_content.required(),
});

// UTIL
export const GET_AMOUNT_SCHEMA = Joi.object({
  amount: Joi.string().regex(/^\d+$/),
});

export const GET_UUID_SCHEMA = Joi.object({
  id: Joi.string()
    .ruleset.regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
    .rule({ message: 'You are not using a valid id.' }),
});
