// ENDPOINTS
export const DEFAULT_ENPOINT = '/api';
export const DREAMS_ENDPOINT = '/dreams';
export const DREAMER_ENDPOINT = '/dreamer';

// RATE LIMITING
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
export const RATE_LIMIT_MAX = 10;

// INPUT LIMITS
// Dreamer
export const DREAMER_USERNAME_MIN_LENGTH = 5;
export const DREAMER_USERNAME_MAX_LENGTH = 15;
export const DREAMER_NICKNAME_MIN_LENGTH = 5;
export const DREAMER_NICKNAME_MAX_LENGTH = 15;
export const DREAMER_PASSWORD_MIN_LENGTH = 5;
export const DREAMER_PASSWORD_MAX_LENGTH = 25;
// Dreams
export const DREAM_TITLE_MIN_LENGTH = 5;
export const DREAM_TITLE_MAX_LENGTH = 75;
export const DREAM_CONTENT_MIN_LENGTH = 10;
export const DREAM_CONTENT_MAX_LENGTH = 750;

// JWT
export const JWTCOOKIENAME = 'sessiontoken';
export const JWTSECRET = 'BgJ133eBIXn8ocqh14T1xB8Vmt7nYZ2Uh8mndn06RBBhlamJmZ';
export const JWTMAXTIME = '15m';
export const JWTMAXTIMEMINUTES = 15;

// DEFAULTS
export const DREAM_AMOUNT_DEFAULT = 10;
