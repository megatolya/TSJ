var db = require('../db'),
    logger = require('../logger'),
    stopper = require('./callbacker')(5);

db.start(function (err) {
    db.models.log.find(function (err, res) {
        logger.info('logs');
        logger.info(res);
        stopper();
    });
    db.models.user.find(function (err, res) {
        logger.info('men');
        logger.info(res);
        stopper();
    });
    db.models.flat.find(function (err, res) {
        logger.info('flats');
        logger.info(res);
        stopper();
    });
    db.models.msg.find(function (err, res) {
        logger.info('messages');
        logger.info(res);
        stopper();
    });
    db.models.month.find(function (err, res) {
        logger.info('months');
        logger.info(res);
        stopper();
    });
});
