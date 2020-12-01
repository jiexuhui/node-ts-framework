import * as bcrypt from 'bcrypt';
import { Connection, getConnection, getConnectionManager, getRepository } from 'typeorm';

import { User } from '../../entity/api/User';

export class UserService {

    usocket: object = {}

    repository = getConnection('hj-mysql').getRepository(User)

    async createUser(user: User): Promise<User> {
        return await this.repository.save(user);
    }

}