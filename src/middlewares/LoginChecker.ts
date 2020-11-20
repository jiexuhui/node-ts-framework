import { Func } from 'mocha';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class LoginChceker implements ExpressErrorMiddlewareInterface {


    error(error: any, request: any, response: any, next: (err?: any) => any) {
        next();
    }
}
