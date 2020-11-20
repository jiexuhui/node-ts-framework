import { User } from '../models/api/UserModel';
import { Cache, ICache } from './cache';

export class UserSession {
    private static prefix = 'login';
    // 登录时长
    private static expire = 12 * 24 * 60 * 60;

    public static getUser(userToken: string): User {
        return Cache.getValue(this.prefix + userToken);
    }

    public static set(userToken: string, value, expire = this.expire) {
        Cache.set(this.prefix + userToken, value, expire);
    }

    public static update(id: string, update: Partial<ICache>) {
        return Cache.update(this.prefix + id, update);
    }
}
