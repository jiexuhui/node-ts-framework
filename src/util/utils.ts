export class Utils {

    /**
     * 数字指定位数前置补0
     * @param num
     * @param length
     */
    public static prefixInteger(num: Number, length: Number): string {
        return (Array(length).join('0') + num).slice(-length);
    }
}
