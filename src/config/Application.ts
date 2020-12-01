import { logger } from '../common/logger';
import { cron } from '../jobs/cron';
import { config } from './config';
import { ExpressConfig } from './Express';
import { connectMysqlDb } from './MysqlDb';
import { setupSockets } from './Socket'

export class Application {

    server: any; 
    express: ExpressConfig;

    constructor() {
        // connectMongo();
        connectMysqlDb()

        this.express = new ExpressConfig();

        const env = this.express.app.get('env');
        const loglevel = config.loglevel;

        let port = config.ports.dev;
        if (env === 'dev') {
            port = config.ports.dev;
        } else if ( env === 'test' ) {
            port = config.ports.test;
        }

        this.server = this.express.app.listen(port, () => {
            logger.info(`
    ----------------
    Server Started!
    App is running in ${env} mode
    Logging initialized at ${loglevel} level

    Http: http://localhost:${port}
    Health: http://localhost:${port}/ping
            `)
        });

        setupSockets(this.server);


        cron.start();
    }
}
