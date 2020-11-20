import expressJwt from 'express-jwt';

import { config } from './config';

const whiteList = [
    /^\/docs/,
    /^\/api-docs/,
];

export function setupAuth(app) {
    app.use(expressJwt({
        secret: config.auth.jwt_secret,
        algorithms: ['HS256'],
        getToken: fromHeaderOrQuerystring,
    }).unless({
        path: whiteList,
    }),
    )
}

function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.autorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return req.query.token;
    }
}
