var fs = require('fs'),
    config = require('./config'),
    format= '.json',
    $ = require('jquery'),
    i18n = {},
    en = {},
    async = require('async');

exports.make = function (callback) {
 fs.readFile(__dirname + '/../i18n/en.json', 'utf8', function (err, content) {
    if (err) throw err;

    en=JSON.parse(content);
    fs.readdir(__dirname+'/../i18n/', function(err, langs) {
        if (err) throw err;

        var tasks = {};
        langs.forEach(function(lang){
            lang = lang.replace(format, '');
            tasks[lang] = function (callback) {
                fs.readFile(__dirname + '/../i18n/' + lang + format, 'utf8', function (err, content) {
                    if (err) throw err;

                    callback(null, $.extend({}, en, JSON.parse(content)));
                });
            };

        });
        async.parallel(tasks, function (err, res) {
            if (!err)
                callback(null, res);
            else
                callback(new Error());
        });
    });
});
}