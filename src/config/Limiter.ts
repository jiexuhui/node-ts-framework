import rateLimit from 'express-rate-limit';

import { CommonUtil } from '../common/common';
import { CustomEror } from '../common/customError';
import { logger } from '../common/logger';
import { config } from './config';

export function setupLimit(app) {
    const limiter = rateLimit({
        windowMs: config.limit.windowMs,
        mas: config.limit.max,

        handler: (req, res, next) => {
            const IP = CommonUtil.getClientIp(req);
            const err = new CustomEror('too many requests');
            logger.warn(`Too many requests, IP: ${IP}`);

            res.status(429).send({
                success: false,
                error: err.toJson(),
            })
        },
    });

    app.use('/', limiter)
}
