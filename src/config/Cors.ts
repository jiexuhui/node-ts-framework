import cors from 'cors';

const whiteList = [
    'http://localhost:8080',
];

const corsOption: any = {
    orgin: function (orgin, cb) {
        if (whiteList.indexOf(orgin) !== -1) {
            cb(null, true);
        } else {
            cb(new Error('Not allow by CORS'));
        }
    },
};

export function setupCors(app) {
    const env = app.get('env');
    if (env === 'dev' || env === 'test') {
        app.use(cors());
    } else {
        app.use(cors(corsOption));
    }
}

