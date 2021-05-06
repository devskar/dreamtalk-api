import { DREAMS_ENDPOINT, DREAMER_ENDPOINT } from './static/const';
import express from 'express';
import dreamsRouter from './routes/dreams';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dreamerRouter from './routes/dreamer';
import {
  errorHandler,
  noEndpointFoundHandler,
  jwtHandler,
} from './utils/handler';

const router = express.Router();

router.use(cookieParser());
router.use(
  cors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

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
