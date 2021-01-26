import { logger } from './../common/logger';
import { CustomEror } from './../common/customError';
import io from 'socket.io';
import * as socketJwt from 'socketio-jwt';
import { config } from './config';
import * as glob from 'glob';
import { defaultMetadataRegistry } from 'event-dispatch/MetadataRegistry';

import('../subscribers/UserSubscriber');


export function setupSockets(app) {
    let server = io(app);

    // use jwt
    server.use(socketJwt.authorize({
        secret: config.auth.jwt_secret,
        handshake: true
    }));

    server.use((socket: any, next) => {
        socket.request.user = socket.decoded_token;
        return next();
    })

    server.on('connection', (socket) => {
        logger.info('Web Socket connection')


        // bind application subscribers to this socket
        defaultMetadataRegistry
            .collectEventsHandlers
            .forEach(eventHandler => {
                const eventNamesForThisHandler = Object.keys(eventHandler);
                eventNamesForThisHandler.forEach(eventName => {
                    const callback = eventHandler[eventName];
                    socket.on(eventName, (req, cb) => {
                        try {
                            if ( typeof req == 'function' ) {
                                cb = req;
                                req = null;
                            }

                            const res = callback({socket, req});
                            if (typeof cb == 'function') cb({ success: true, res });
                        } catch (error) {
                            logger.error(`event eventname err: ${error}`);
                            if (!(error instanceof CustomEror)) {
                                error = new CustomEror('unexpecter error', error.message || error.stack);
                            }

                            if (typeof cb == 'function') cb({ success: false, error: error.toJson() })
                        }
                    })
                })
            })
    })
}