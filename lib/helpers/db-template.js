var db = require('../db');

db.start(function (err) {
    if (err) return err;
    new db.models.admin({
        login: 'admin',
        password: '321'
    }).save(function (err, admin) {
        new db.models.building({
            info: {},
            _admin: admin._id,
            address: 'Улица Пушкина, дом Колотушкина'
        }).save(function (err, building) {
            new db.models.flat({
                balance: 100,
                number: 1,
                _building: building._id
            }).save(function (err, flat) {
                new db.models.person({
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
                number: 1,
                _building: building._id
            }).save(function (err, flat) {
                new db.models.person({
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
});