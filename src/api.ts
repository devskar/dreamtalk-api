import { ErrorWithStatus, removeEmptyOrNull } from './utils';
import { DREAMS_ENDPOINT, DREAMER_ENDPOINT } from './static/const';
import express from 'express';
import dreamsRouter from './routes/dreams';
import dreamerRouter from './routes/dreamer';

const router = express.Router();

// CORS ERROR HANDLING
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.header('Access-Contorl-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }

  next();
});

// SETTING UP ROUTES
router.use(DREAMS_ENDPOINT, dreamsRouter);
router.use(DREAMER_ENDPOINT, dreamerRouter);

// Handles request if no route was found
router.use((req, res, next) => {
  const err = new Error('This endpoint does not exist.') as ErrorWithStatus;
  err.status = 404;

  next(err);
});

// Handles all error request that get passed
router.use(
  (
    err: ErrorWithStatus,
    req: express.Request,
    res: express.Response,
    next: () => void
  ) => {
    res.status(err.status || 500).json(
      removeEmptyOrNull({
        error: {
          message: err.message,
          messages: err.messages,
        },
      })
    );
  }
);

export default router;
