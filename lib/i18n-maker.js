var fs = require('fs'),
    config = require('./config'),
    format= '.json',
    $ = require('jquery'),
    i18n = {},
    en = {},
    async = require('async'),
    logger = require('./logger');

exports.make = function (callback) {
 fs.readFile(__dirname + '/../i18n/en.json', 'utf8', function (err, content) {
    if (err) throw err;

    en=JSON.parse(content);
    fs.readdir(__dirname+'/../i18n/', function(err, langs) {
        if (err) throw err;

        var tasks = {};
        langs.forEach(function(lang){
            lang = lang.replace(format, '');
            logger.info('building language ' + lang);
            tasks[lang] = function (callback) {
                fs.readFile(__dirname + '/../i18n/' + lang + format, 'utf8', function (err, content) {
                    if (err) callback(err);

                    callback(null, $.extend({}, en, JSON.parse(content)));
                });
            };

        });
        async.parallel(tasks, function (err, res) {
            if (!err)
                callback(null, res);
            else
                callback(err);
        });
    });
});
}
