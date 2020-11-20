import { CronJob } from 'cron';

// import { Container } from 'typedi';
import { logger } from '../common/logger';
import { Cache } from '../util/cache';

const cron = new CronJob('0 * * * * *', () => {
    logger.debug('Executing cron job once every minute');

    Cache.clearExprired();
})

export { cron };
