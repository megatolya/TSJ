var winston = require('winston'),
    logger = new (winston.Logger)({
        transports: [
                  new (winston.transports.Console)({
                      colorize: true,
                      exitOnError: false
                }),
                  new (winston.transports.File)({ filename: 'debug.log' })
                ]
        });

module.exports = logger;
