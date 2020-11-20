import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as health from 'express-ping';
import expressValidator from 'express-validator';
import * as path from 'path';
import { Action, useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';

import { PublicController } from '../controllers/api/PublicController';
import { UserSession } from '../util/userSession';
import { setupAuth } from './Authentication';
import { setupCors } from './Cors';
import { setupLimit } from './Limiter';
import { setupLogging } from './Logging';

export class ExpressConfig {


    app: express.Express;

    constructor() {
        this.app = express();
        this.app.set('x-powered-by', false);

        this.app.use(cors());

        setupCors(this.app);
        const env = this.app.get('env');
        if (env === 'dev' || env === 'test') {
            // swagger
        }

        setupLogging(this.app);
        // setupLimit(this.app);
        // setupAuth(this.app);

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(health.ping());
        this.app.use(expressValidator());


        this.setupControllers()
    }

    setupControllers() {
        useContainer(Container);
        useExpressServer(this.app, {
            routePrefix: '/api/v1',
            controllers: [path.resolve(__dirname, '../controllers/**/*')],
            middlewares: [path.resolve(__dirname, '../middlewares/**')],
            interceptors: [path.resolve(__dirname, '../interceptors/**')],
            validation: false,
            defaultErrorHandler: false,

            // currentUserChecker: async (action: Action) => {
            //     const curentUser = UserSession.getUser(action.request.token) || action.request.user;
            //     return curentUser;
            // },

            // authorizationChecker: async (action: Action, permissions: string[]) => {
            //     if (!permissions.length)
            //         return true;

            //     const curentUser = UserSession.getUser(action.request.token) || action.request.user;
            //     if (curentUser && curentUser.permissions
            //         && permissions.find(permission => curentUser.permissions.indexOf(permission) !== -1))
            //         return true;
            //     return false
            // },
        });

        this.app.get('/api/public/file/ext', PublicController.getFileExt)
    }
}

