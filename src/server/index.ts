import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import * as logger from 'morgan';
import * as path from 'path';

import { globFiles } from '../helpers';
import { DB_CONNECTION_STRING, MODELS_DIR, ROUTES_DIR, USE_DB } from '../var/config';

export default function() {
  const app: express.Express = express()

  for (const model of globFiles(MODELS_DIR)) {
    require(path.resolve(model))
  }

  // if (USE_DB) {
  //   mongoose
  //     .connect(DB_CONNECTION_STRING, {
  //       promiseLibrary: global.Promise,
  //       useMongoClient: true,
  //     })
  //     .catch(() => {
  //       console.log('Error connecting to mongo')
  //     })
  // }

  app.set('views', path.join(__dirname, '../../src/views'))
  app.set('view engine', 'pug')

  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(express.static(path.join(__dirname, '../../src/public')))

  for (const route of globFiles(ROUTES_DIR)) {
    require(path.resolve(route)).default(app)
  }

  return app
}
