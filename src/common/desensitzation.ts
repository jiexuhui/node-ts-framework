/**
 * 字符串脱敏工具类
 */
export class Desensitization {

    /**
     * 手机号脱敏
     * @param str
     * @returns {string}
     */
    public static phone(str: string) {
        return this.desensization(str, 3, 4);
    }

    /**
     * 证件号码脱敏
     * @param str 
     */
    public static idcode(str: string): string {
        return this.desensization(str, 4, 4);
    }

    /**
     * 姓名脱敏
     * @param str 
     */
    public static realname(str: string): string {
        let res: string;
        if (str.length < 3) res = this.desensization(str, 1, 0);
        else res = this.desensization(str, 2, 0);
        return res;
    }
    /**
     * 字符串脱敏
     * @param str
     * @param begin
     * @param senlen
     */
    private static desensization(str: string, begin: number, senlen: number = 0): string {
        const len = str.length;
        if (len <= begin + senlen) return str;

        const fstr = str.substr(0, begin);
        const lstr = (senlen === 0 ? '' : str.substr(-senlen));

        const mstr = str.substring(begin, len - senlen).replace(/[\s\S]/ig, '*');

        return fstr + mstr + lstr;
    }
}