const http = require('http');
const https = require('https');
const Url = require('url');
const Moment = require('moment');
const Logger = require('../helpers/Logger');
const { isJSONString } = require('../helpers/JSONHelper');

const callService = (method, isHttps, options, body, callback) => {
    const protocol = (isHttps) ? https : http;
    const path = (options.qs) ? `${options.path}?${options.qs}` : options.path;

    const httpsOptions = {
        hostname: options.host,
        path: path,
        method: method
    };

    if (options.port) httpsOptions.port = options.port;
    if (options.headers) httpsOptions.headers = options.headers;
    
    const timeStart = process.hrtime();
    const startDateTime= Moment().format('YYYY-MM-DD HH:mm:ss');
    
    const request = protocol.request(httpsOptions, (response) => {
        response.setEncoding('utf8');
        
        let responseBody = '';

        response.on('data', (resBody) => {
            responseBody += resBody;
        });

        response.on('error', (resError) => {
            responseBody += resError;
        });

        response.on('end', () => {
            responseBody = isJSONString(responseBody) ? JSON.parse(responseBody) : responseBody;
            const finalRes = { timeStart, startDateTime, response, responseBody };

            return processResult(method, isHttps, options, body, finalRes, callback);
        });
    });

    if (options.timeout) {
        const DEFAULT_TIMEOUT = 21000;
        const reqTimeout = parseInt(options.timeout);
        const timeout = (reqTimeout > DEFAULT_TIMEOUT) ? DEFAULT_TIMEOUT : reqTimeout;
        options.timeout = timeout;

        setTimeout(() => request.abort(), timeout);
    }
    
    request.on('error', (reqError) => {
        if (reqError.code === 'ECONNRESET') reqError = { message: 'ECONNRESET: request timeout' };
        const finalRes = { timeStart, startDateTime, err: reqError };

        return processResult(method, isHttps, options, body, finalRes, callback);
    });

    if (body) {
        const postData = JSON.stringify(body);
        request.write(postData);
    }

    request.end();
};

const processResult = (method, isHttps, options, body, result, callback) => {
    const { timeStart, startDateTime, err, response, responseBody } = result;

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const path = (options.qs) ? `${options.path}?${options.qs}` : options.path;
    const uri = `${(isHttps) ? 'https' : 'http'}://${options.host}${(options.port) ? ':' + options.port : ''}${path}`;

    const logData =  {
        status: (response && response.statusCode) || null,
        method: method,
        uri: uri,
        httpResponse: {
            headers: (response && response.headers) || null,
            body: responseBody || null,
            statusMessage: (response && response.statusMessage) || null,
            error: err || null,
        },
        timeTaken: timeTaken,
        timeout: options.timeout || null,
        startDateTime: startDateTime,
        dateTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    if (err) Logger.error(err);
    Logger.info(logData);

    return callback(err, response, responseBody);
};

module.exports = {
    get: (isHttps, options, callback) => {
        callService('GET', isHttps, options, body = null, callback);
    },
    post: (isHttps, options, body, callback) => {
        callService('POST', isHttps, options, body, callback);
    }
};