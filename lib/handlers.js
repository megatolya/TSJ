var models = require('./db').models;

module.exports = {
    mobileVerstka : function (req, res) {
        res.render('mobileVerstka.jade');
    },
    testDb : function (req, res) {
        models.person.find(function (err, men) {
            if (!err)
                res.send('ok!');
        });
    }
};