const Express = require('express');
const BodyParser = require('body-parser');
const App = Express();
const Path = require('path');
require('dotenv').config({ path: Path.join(__dirname, '.env')});
const Logger = require('./server/helpers/Logger');
const Cors = require('./server/middlewares/Cors');
const TransactionId = require('./server/middlewares/TransactionId');
const { connectMongoDb, config: mongoConfig } = require('./server/services/MongoDbService');

const CustomerRoute = require('./server/routes/CustomerRoute');
const AgeDistribution = require('./server/routes/AgeDistributionRoute')
const Count = require('./server/routes/CountRoute')

const PORT = process.env.PORT || 8080;
const API_PATH = process.env.API_PATH || '';
const BASE_PATH = API_PATH ? `/${API_PATH}`: '';
const BASE_URL = process.env.NODE_ENV === 'PRODUCTION'
    ? `${URL_PRODUCTION}`
    :`localhost:${PORT}${BASE_PATH}`;

const server = App.listen(PORT, async () => {
    try {
        await connectMongoDb();
        Logger.info(`App Base Url: ${BASE_URL}`);
        Logger.info(`Communicating to DB: ${mongoConfig.url}`);
    } catch (err) {
        Logger.error(err);
    }
});

App.use(TransactionId);

App.use(Cors);

App.use(Express.json());

App.use(BodyParser.urlencoded({ limit: '50mb', extended: true }));
App.use(BodyParser.json({limit: '50mb'}));

App.use(`${BASE_PATH}/customer`, CustomerRoute);
App.use(`${BASE_PATH}/age-gender-distribution`, AgeDistribution);
App.use(`${BASE_PATH}/count`, Count);

App.use((req, res) => {
    res.status(404).send({ error: 'Not Found' });
});

const stopServer = () => {
    server.close((err) => {
        Logger.info('server: Exit', { err });
    });
};

process.on('exit', () => {
    stopServer();
});

process.on('SIGINT', () => {
    stopServer();
});

process.on('uncaughtException', err => {
    if (err) Logger.error(err);
    Logger.info('uncaughtException: Exit');
    stopServer();
    process.exit(99);
});