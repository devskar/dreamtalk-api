import Joi from 'joi';

export const DREAMS_TABLE_NAME = 'dreams';

// SCHEMAS
export const DREAM_SCHEMA = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  content: Joi.string().min(20).max(500).required(),
  author_id: Joi.string().required(),
});

export const USER_SCHEMA = Joi.object({
  name: Joi.string().alphanum().min(3).max(12),
  email: Joi.string().email(),
});

// ENDPOINTS
export const DEFAULT_ENPOINT = '/api';
export const DREAMS_ENDPOINT = '/dreams';
export const DREAMER_ENDPOINT = '/dreamer';

// RATE LIMITING
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
export const RATE_LIMIT_MAX = 10;

export const __prod__ = process.env.NODE_ENV === 'production';
