import * as expressWinston from 'express-winston';

import { logger } from '../common/logger';

export function setupLogging(app) {
    process.on('unhandledRejection', function (reason, p) {
        console.log('Possibly Unhandler Rejection at: ', p, '\nReason: ', reason);
    });

    setupExpress(app);
}

function setupExpress(app) {
    app.use(expressWinston.logger({
        winstonInstance: logger,
        msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        expressFormat: true,
        meta: false,
        statusLevels: {
            'success': 'info',
            'warn': 'warn',
            'error': 'error',
        },
        ignoreRoute: (req, res) => false,
    }));
}
