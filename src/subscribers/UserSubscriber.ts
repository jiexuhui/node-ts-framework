
import { UserService } from './../services/api/UserService';
import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import { logger } from '../common/logger';

@EventSubscriber()
export class UserSubscriber {
    userService: UserService = Container.get(UserService);

    @On('onLogin')
    onLogin( { socket } ) {
        const token = socket.reques._query.token;
        socket.token = token;
        logger.info('Web Sockets onLogin');

        this.userService.usocket[token] = socket;
        return true;
    }

    @On('disconnect')
    disconnect({socket}) {
        logger.info('Web Sockets disconnect') 

        if (socket.token in this.userService.usocket) {
            delete (this.userService.usocket[socket.token]);
        }
    }
}