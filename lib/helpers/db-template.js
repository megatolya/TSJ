var db = require('../db');

db.start(function (err) {
    if (err) return err;
    new db.models.admin({
        login: 'admin',
        password: '321'
    }).save(function (err, admin) {
        new db.models.flat({
            balance: 100,
            number: 1
        }).save(function (err, flat) {
            new db.models.user({
                login: 'megatolya',
                password: '123',
                name: 'Толя Островский',
                cash: 1000,
                info: {},
                _flat: flat._id
            }).save();
        });
        new db.models.flat({
            balance: 1000,
            number: 1
        }).save(function (err, flat) {
            new db.models.user({
                login: 'ololo',
                password: '132131',
                name: 'Пушкин Александр',
                cash: 10,
                info: {},
                _flat: flat._id
            }).save();
        });
    });
});