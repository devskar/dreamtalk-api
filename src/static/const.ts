// ENDPOINTS
export const DEFAULT_ENPOINT = '/api';
export const DREAMS_ENDPOINT = '/dreams';
export const DREAMER_ENDPOINT = '/dreamer';

// RATE LIMITING
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
export const RATE_LIMIT_MAX = 10;

export const __prod__ = process.env.NODE_ENV === 'production';
