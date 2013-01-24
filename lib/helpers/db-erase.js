var db = require('../db');

db.start(function (err) {
    db.models.person.find(function (err, res) {
        console.log('erasing persons');
        res.forEach(function (item) {
            item.remove();
        });
        return;
    });
    db.models.admin.find(function (err, res) {
        console.log('erasing admins');
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
    db.models.building.find(function (err, res) {
        console.log('erasing building');
        res.forEach(function (item) {
            item.remove();
        });
        return;
    });
    return;
});