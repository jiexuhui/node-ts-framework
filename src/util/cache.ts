export interface ICache {
    value: any,
    expireTime: Date;
    lastTIme: Date;
    [key: string]: any
}

export class Cache {

    private static cacheMap = new Map<string, ICache>()

    /**
     * 获取缓存
     * @param key
     */
    static getValue(key: string) {
        if (this.cacheMap.has(key)) {
            // 如果已过期
            if (this.cacheMap.get(key).expireTime.getTime() <= Date.now()) {
                this.cacheMap.delete(key);
                return null;
            } else {
                return this.cacheMap.get(key).value;
            }
        } else {
            return null;
        }
    }

    /**
     * 获取缓存数据
     * @param key
     */
    static get(key: string) {
        return this.cacheMap.get(key)
    }

    /**
     * 设置缓存
     * @param key
     * @param value
     * @param expire
     * @param other
     */
    static set(key: string, value: any, expire: number, other?: { [key: string]: any }) {
        const expireTime = new Date();
        expireTime.setSeconds(expireTime.getSeconds() + expire);
        const cache: ICache = Object.assign({}, {
            value,
            expireTime,
            lastTIme: new Date(),
        }, other);

        this.cacheMap.set(key, cache);
    }

    /**
     * 删除缓存
     * @param key
     */
    static delete(key: string) {
        if (this.cacheMap.has(key)) {
            this.cacheMap.delete(key);
        }
    }

    /**
     * 更新缓存
     * @param key
     * @param update
     */
    public static update(key: string, update: Partial<ICache>) {
        const cache = this.cacheMap.get(key);
        Object.assign(cache, update);
        this.cacheMap.set(key, cache);
        return cache;
    }

    /**
     * 清空过期缓存
     */
    public static clearExprired() {
        this.cacheMap.forEach( (value, key) => {
            if (value.expireTime.getTime() <= Date.now()) {
                this.cacheMap.delete(key);
            }
        })
    }
}
