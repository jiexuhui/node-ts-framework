import axios from 'axios';
import * as crypto from 'crypto';

import { md5, sha1 } from './crypto';

export class TTUtils {

    /**
     * 获取sessionKey
     * @param appId
     * @param secret
     * @param code
     */
    public static async getSessionKey(appId: string, secret: string, code: string): Promise<Object> {
        const url = 'https://developer.toutiao.com/api/apps/jscode2session';
        const result = await axios.get(url, { params: { appid: appId, secret, code } })
        return result.data
    }


    /**
     * 校验签名
     * @param sign
     */
    public static async checkSign(sign, sessionKey, rawData) {
        let signation = sha1(`${rawData}${sessionKey}`)

        return sign == signation
    }


    /**
     * 解析敏感数据
     * @param sessionKey
     * @param encryptedData
     */
    static async decryptedData(sessionKey, encryptedData, iv) {
        sessionKey = Buffer.from(sessionKey, 'base64');
        encryptedData = Buffer.from(encryptedData, 'base64');
        iv = Buffer.from(iv, 'base64');

        // 解密
        const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);

        decipher.setAutoPadding(true);
        let decoded: any = decipher.update(encryptedData, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        decoded = JSON.parse(decoded);

        return decoded;
    }
}