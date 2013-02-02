var db = require('../db');

db.start(function (err) {
    db.models.user.find(function (err, res) {
        console.log('erasing users');
        res.forEach(function (item) {
            item.remove();
        });
        return;
    });
    db.models.flat.find(function (err, res) {
        console.log('erasing flats');
        res.forEach(function (item) {
            item.remove();
        });
        return;
    });
    db.models.msg.find(function (err, res) {
        console.log('erasing messages');
        res.forEach(function (item) {
            item.remove();
        });
        return;
    });
    return;
});