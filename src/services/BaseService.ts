import { Document, Model, Types } from 'mongoose';

import { PageData } from '../common/pageData';

export abstract class BaseService<T> {
    abstract repository: Model<T & Document>;

    /**
     *
     * @param conditions
     * @param projection
     * @param options
     */
    async find(conditions: any, projection?: any, sort?: any, options?: any): Promise<T[]> {
        conditions.isDeleted = {$ne: 1};
        return await this.repository.find(conditions, projection, options).sort(sort).lean() as T[];
    }

    /**
     *
     * @param conditions
     * @param projection
     * @param options
     */
    async findOne(conditions: any, projection?: any, options?: any): Promise<T> {
        conditions.isDeleted = {$ne: 1};
        return await this.repository.findOne(conditions, projection, options);
    }

    /**
     *
     * @param projection
     * @param sort
     */
    async findAll(projection?: any, sort?: any): Promise<T[]> {
        let condition: any = { isDeleted: { $ne: 1 } };
        return await this.repository.find(condition, projection).sort(sort).lean() as T[];
    }

    /**
     *
     * @param conditions
     */
    async countDocument(conditions: any): Promise<number> {
        conditions.isDeleted = { $ne: 1 };
        return await this.repository.countDocuments(conditions);
    }


    /**
     *
     * @param conditions
     * @param page
     * @param pageSize
     * @param projection
     * @param sort
     */
    async findByPage(conditions: any, page: number = 1, pageSize: number = 10, projection?: any, sort?: any): Promise<PageData<T>> {
        conditions.isDeleted = { $ne: 1 };
        const pageData = new PageData<T>(page, pageSize);
        pageData.total = await this.repository.countDocuments(conditions);
        pageData.dataList = await this.repository.find(conditions, projection).limit(pageSize).skip((page - 1) * pageSize).sort(sort).lean() as T[];
        pageData.hasMore = pageData.total - (page - 1) * pageSize > pageSize ? true : false;
        return pageData
    }

    /**
     *
     * @param doc
     */
    async save(doc: T): Promise<T> {
        return (await new this.repository(doc).save()).toObject({ virtuals: true });
    }

    /**
     *
     */
    async saveMany(docs: any): Promise<T> {
        return await this.repository.create(docs);
    }

    /**
     *
     * @param doc
     */
    async findOneAndUpdate(doc: T): Promise<T> {
        const conditions = {};
        if ((doc as any)._id) {
            conditions['_id'] = (doc as any)._id;
        } else {
            const fieldName = this.repository.modelName.toLowerCase() + 'Id';
            conditions[fieldName] = (doc as any)[fieldName];
        }

        return await this.repository.findByIdAndUpdate(conditions, doc, { new: true }).lean();
    }
}