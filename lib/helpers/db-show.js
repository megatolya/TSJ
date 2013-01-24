var db = require('../db');

db.start(function (err) {
    db.models.person.find(function (err, res) {
        console.log('men');
        console.log(res);
        return;
    });
    db.models.admin.find(function (err, res) {
        console.log('admins');
        console.log(res);
        return;
    });
    db.models.flat.find(function (err, res) {
        console.log('flats');
        console.log(res);
        return;
    });
    db.models.building.find(function (err, res) {
        console.log('building');
        console.log(res);
        return;
    });
    return;
});