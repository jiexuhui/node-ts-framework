import * as bluebird from 'bluebird';
import mongoose from 'mongoose';

import { logger } from '../common/logger';
import { config } from './config';

export function connectMongo() {
    const mongoUrl: string = config.mongo.url;
    // (mongoose as any).Promise = bluebird;
    mongoose.Promise = global.Promise;
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true} as Object)
    .then(
        () => {
            logger.info('MongoDb connection success!')
        },
    ).catch(err => {
        logger.error('MongoDb connection error. Please make sure MongoDb is running.' + err)
    })
}
