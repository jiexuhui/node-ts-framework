import * as winston from 'winston';

import { config } from '../config/config';

const myFormat = winston.format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

const options: winston.LoggerOptions = {
    level: config.loglevel,
    transports: [
        // - Write all logs with level `error` (and below) to `error.log`
        new winston.transports.File({
            level: 'error',
            filename: 'logs/error.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                myFormat,
            ),
        }),

        // - Write all logs with level `info` (and below) to `combined.log`
        new winston.transports.File({
            level: 'info',
            filename: 'logs/combined.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                myFormat,
            ),
        }),

        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),


    ],
}

export const logger = winston.createLogger(options);

