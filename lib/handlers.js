var api = require('./api'),
    models = require('./db').models;

module.exports = {
    mobileVerstka : function (req, res) {
        res.render('mobileVerstka.jade');
    },
    testDb : function (req, res) {
        models.person.find(function (err, men) {
            if (!err)
                res.send('ok!');
            else
                res.send('not ok! :-(');
        });
    },
    api : function (req, res) {
        var model = req.params[0],
            id = req.params[1];

        api[model](id, function (err, doc) {
            if (err) {
                console.log(err);
                res.send(500);
            }
            res.send(doc);
        });

    }
};