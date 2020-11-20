import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { Inject } from 'typedi';

import { CustomEror } from '../common/customError';

@Middleware({ type: 'after' })
export class CustomErorHandler implements ExpressErrorMiddlewareInterface {


    async error(err: any, request: any,  response: any, next: (err?: any) => any): Promise<any> {
        if (!(err instanceof CustomEror)) {
            if (err.name === 'UnauthorizedError' || err.name === 'AuthorizationRequiredError') {
                if (err.inner && err.inner.name === 'TokenExpiredError') {
                    return response.status(401).json({
                        success: true,
                        error: { code: '-1', message:  'login timeout' },
                    })
                } else {
                    return response.status(401).send({
                        success: false,
                        error: { code: -1, message: 'not login' },
                    })
                }
            }
        } else {
            return response.status(200).send({
                success: false,
                error: err.toJson(),
            })
        }
    }
}
