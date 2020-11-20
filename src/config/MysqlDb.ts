import {
    Connection, createConnection, createConnections, getConnection, getRepository
} from 'typeorm';

import { logger } from '../common/logger';

export async function connectMysqlDb() {
    const connections: Connection[] = await createConnections();
    if (connections.length <= 0) {
        logger.error('数据库连接失败');
    } else {
        logger.info('数据库连接成功>>');
    }

}
