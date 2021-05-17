import {
  DREAMS_ENDPOINT,
  DREAMER_ENDPOINT,
  COMMENTS_ENDPOINT,
  REPLY_ENDPOINT,
} from './static/const';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dreamsRouter from './routes/dreams';
import dreamerRouter from './routes/dreamer';
import commentRouter from './routes/comments';
import replyRouter from './routes/replies';
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
router.use(COMMENTS_ENDPOINT, commentRouter);
router.use(REPLY_ENDPOINT, replyRouter);

// Handles request if no route was found
router.use(noEndpointFoundHandler);

// Handles all error request that get passed to handle errors
router.use(errorHandler);

export default router;
