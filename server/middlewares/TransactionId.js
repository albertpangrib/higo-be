const Moment = require('moment');
const Crypto = require("crypto");
const { get_ip: getIp } = require('ipware')();
const Logger = require('../helpers/Logger');
const { getDurationInMilliseconds } = require('../helpers/DatetimeHelper');

module.exports = (req, res, next) => {
    const app = 'higo--betest';
    const start = Moment();
    const processStart = process.hrtime();
    const timeStamp = start.format('YYYYMMDDHHmmssSSS');
    const normalTime = start.format('YYYY-MM-DD HH:mm:ss.SSS');
    const uniqueId = Crypto.randomBytes(16).toString("hex");
    const transactionId = `${app}${timeStamp}${uniqueId}`;
    req.header['transactionId'] = transactionId;
    req['startTime'] = timeStamp;
    
    Logger.info({
        transactionId: transactionId,
        status: 'started',
        url: req.originalUrl,
        method: req.method,
        ip: getIp(req).clientIp,
        startTime: normalTime
    });

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(processStart);
        const endTime = Moment(start).add(durationInMilliseconds, 'millisecond').format('YYYY-MM-DD HH:mm:ss.SSS');
        Logger.info({
            transactionId: transactionId,
            status: 'finished',
            url: req.originalUrl,
            method: req.method,
            ip: getIp(req).clientIp,
            finishedTime: endTime,
            timeTaken: durationInMilliseconds
        });
    });

    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds(processStart);
        const endTime = Moment(start).add(durationInMilliseconds, 'millisecond').format('YYYY-MM-DD HH:mm:ss.SSS');
        Logger.info({
            transactionId: transactionId,
            status: 'closed',
            url: req.originalUrl,
            method: req.method,
            ip: getIp(req).clientIp,
            closedTime: endTime,
            timeTaken: durationInMilliseconds
        });
    });

    next();
};