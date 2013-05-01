var db = require('../db'),
    logger = require('../logger');

db.start(function (err) {
    db.models.user.find(function (err, res) {
        logger.info('erasing users');
        res.forEach(function (item) {
            item.remove();
        });
    });
    db.models.flat.find(function (err, res) {
        logger.info('erasing flats');
        res.forEach(function (item) {
            item.remove();
        });
    });
    db.models.log.find(function (err, res) {
        logger.info('erasing logs');
        res.forEach(function (item) {
            item.remove();
        });
    });
    db.models.msg.find(function (err, res) {
        logger.info('erasing messages');
        res.forEach(function (item) {
            item.remove();
        });
    });
    db.models.month.find(function (err, res) {
        logger.info('erasing months');
        res.forEach(function (item) {
            item.remove();
        });
    });
});
