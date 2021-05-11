import Joi from 'joi';

// SCHEMAS
export const DREAMER_SIGNUP_SCHEMA = Joi.object({
  username: Joi.string().alphanum().min(5).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(5).max(25).required(),
});

export const DREAMER_LOGIN_SCHEMA = Joi.object({
  username: Joi.string().alphanum().min(5).max(15),
  email: Joi.string().email(),
  password: Joi.string().alphanum().min(5).max(25).required(),
});

export const DREAM_CREATE_SCHEMA = Joi.object({
  title: Joi.string().min(5).max(75).required(),
  content: Joi.string().min(10).max(750).required(),
});

export const GET_AMOUNT_SCHEMA = Joi.object({
  amount: Joi.string().regex(/^\d+$/),
});
