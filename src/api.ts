import { ErrorWithStatus, removeEmptyOrNull } from './utils/utils';
import { DREAMS_ENDPOINT, DREAMER_ENDPOINT } from './static/const';
import express from 'express';
import dreamsRouter from './routes/dreams';
import dreamerRouter from './routes/dreamer';
import {
  errorHandler,
  noEndpointFoundHandler,
  corsHandler,
  jwtHandler,
} from './utils/handler';

const router = express.Router();

// CORS ERROR HANDLING
router.use(corsHandler);

// JWT HANDLING
router.use(jwtHandler);

// SETTING UP ROUTES
router.use(DREAMS_ENDPOINT, dreamsRouter);
router.use(DREAMER_ENDPOINT, dreamerRouter);

// Handles request if no route was found
router.use(noEndpointFoundHandler);

// Handles all error request that get passed to handle errors
router.use(errorHandler);

export default router;
