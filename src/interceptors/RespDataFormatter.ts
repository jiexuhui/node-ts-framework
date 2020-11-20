import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Stream } from 'stream';

@Interceptor()
export class ResponseDataFormatter implements InterceptorInterface {

    intercept(action: Action, content: any) {
        if (content instanceof Stream) {
            return content;
        }

        return action.response.send({
            success: true,
            code: 200,
            data: content || null,
        })
    }
}
