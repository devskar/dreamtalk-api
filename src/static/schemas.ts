import Joi from 'joi';

// SCHEMAS
export const DREAMER_SIGNUP_SCHEMA = Joi.object({
  username: Joi.string().alphanum().min(5).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(5).max(25).required(),
});
