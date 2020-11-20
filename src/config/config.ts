import * as path from 'path';
import * as yaml from 'yamljs';

const config = yaml.load(path.join(process.cwd(), './config/default.yaml'));

const env = process.env.NODE_ENV;

if (env === 'dev') {
    config.mongo.url = config.mongo.mongo.url_dev;
} else if (env === 'test') {
    config.mongo.url = config.mongo.mongo.url_test;
}

export { config };
