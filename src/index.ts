import { DEFAULT_ENPOINT } from './const';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import router from './api';

const port = process.env.PORT || 3000;

createConnection()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(morgan('dev'));

    app.use(DEFAULT_ENPOINT, router);

    // make sure to do nothing if the /api route isnt targeted
    app.use('', (req, res, next) => {
      // do nothing
    });

    app.listen(port, () => console.log('Listening on port', port));
  })
  .catch((error) => console.log(error));
