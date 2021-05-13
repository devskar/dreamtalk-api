import Joi from 'joi';

// RULES
const dreamer_username = Joi.string().alphanum().min(5).max(15);
const dreamer_nickname = Joi.string().alphanum().min(5).max(15);
const dreamer_email = Joi.string().email();
const dreamer_password = Joi.string().alphanum().min(5).max(25);

const dream_title = Joi.string().min(5).max(75);
const dream_content = Joi.string().min(10).max(750);

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
