var db = require('../db'),
    logger = require('../logger'),
    async = require('async'),
    models = ['flat', 'user', 'log', 'msg', 'month'];

function erase(totalCount) {
    var stopper = require('./callbacker')(totalCount);

    models.forEach(function (model) {
        var models = model + 's';

        db.models[model].find(function (err, res) {
            logger.info('erasing ' + models);
            res.forEach(function (item) {
                item.remove(function () {
                    logger.info('removed ' + model + ' ' + item._id)
                    stopper();
                });
            });
        });
    });

}

db.start(function (err) {
    var tasks = [];

    models.forEach(function (model) {
        var models = model + 's';

        tasks.push(function (callback) {
            db.models[model].count(function (err, count) {
                logger.info('count for ' + models + ' is ' + count);
                callback(null, count);
            });
        });
    });
    async.parallel(tasks, function (err, counts) {
        var totalCount = 0;

        counts.forEach(function (count) {
            totalCount += count;
        });
        erase(totalCount);
    });
});
