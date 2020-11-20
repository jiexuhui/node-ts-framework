import * as uuid from 'uuid';

export class CommonUtil {
    
    /**
     * 获取客户端IP
     * @param req 
     * @returns {string}
     */
    public static getClientIp(req): string {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
    }

    /**
     * 获取uuid
     * @returns {string}
     */
    public static getUuid(): string {
        return uuid.v4().replace(/-/g, '');
    }

}