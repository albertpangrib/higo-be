const winston = require('winston');
const Path = require('path');
const Stringify = require('json-stringify-safe');
const { format } = winston;
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    if (typeof message === 'object') {
        message = `data: ${Stringify(message)}`;
    }
    
    return `${timestamp}, [${label}, ${level}], ${message}`;
});

const options = {
    file: {
        level: 'info',
        filename: '../higo- betest-log/higo- betest.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880,
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: false,
    },
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    format: combine(
        label({ label: Path.basename(process.pid.toString()) }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        myFormat
    ),
    exitOnError: false,
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    },
};

module.exports = logger;