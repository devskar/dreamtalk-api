import { DEFAULT_ENPOINT as DEFAULT_ENDPOINT } from './static/const';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import router from './api';

const port = process.env.PORT || 3001;

createConnection()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(morgan('dev'));

    app.use(helmet());

    app.use(DEFAULT_ENDPOINT, router);

    // make sure to do nothing if the /api route isnt targeted
    app.use('', (req, res, next) => {
      // do nothing
    });

    app.listen(port, () => console.log('Listening on port', port));
  })
  .catch((error) => console.log(error));
