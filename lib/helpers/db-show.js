var db = require('../db');

db.start(function (err) {
    db.models.log.find(function (err, res) {
        console.log('logs');
        console.log(res);
        return;
    });
    db.models.user.find(function (err, res) {
        console.log('men');
        console.log(res);
        return;
    });
    db.models.flat.find(function (err, res) {
        console.log('flats');
        console.log(res);
        return;
    });
    db.models.msg.find(function (err, res) {
        console.log('messages');
        console.log(res);
        return;
    });
    return;
});
