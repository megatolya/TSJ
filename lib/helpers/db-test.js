var logger = require('./lib/logger');

require('../db').start(function (err) {
    if(!err) {
        logger.info('db ready');
        process.exit(0);
    } else {
        console.log(err);
        process.exit(1);
    }
});
