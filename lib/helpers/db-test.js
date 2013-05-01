var logger = require('../logger');

require('../db').start(function (err) {
    if(!err) {
        logger.info('db ready');
        process.exit(0);
    } else {
        logger.error(err);
        process.exit(1);
    }
});
