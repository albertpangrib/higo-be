const mongoose = require('mongoose');

const config = {
    url: process.env.MONGODB_URL_PRODUCTION,
    dbName: process.env.MONGODB_DB_NAME
};

const connectMongoDb = () => {
    return mongoose.connect(config.url, {
        dbName: config.dbName
    });
};

module.exports = {
    config,
    connectMongoDb
};