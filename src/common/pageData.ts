export class PageData<T> {
    page: number = 1;
    pageSize: number = 10;
    total: number;
    hasMore: boolean;
    dataList: T[];

    constructor(page: number, pageSize: number) {
        this.page = page;
        this.pageSize = pageSize;
    }
}