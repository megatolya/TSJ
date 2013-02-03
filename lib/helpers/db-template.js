var db = require('../db');

db.start(function (err) {
    if (err) return err;
    new db.models.user({
        login: 'admin',
        password: '321',
        name: 'Admin',
        phone: '89260030201',
        type: 'admin',
        _flat: null
    }).save(function (err, admin) {
        new db.models.flat({
            balance: 100,
            perMonthPayment: 3000,
            number: 1
        }).save(function (err, flat) {
            new db.models.user({
                login: 'megatolya',
                password: '123',
                name: 'Толя Островский',
                phone: '98267030201',
                type: 'user',
                _flat: flat._id
            }).save(function (err, user) {
                new db.models.log({
                    type: 'payment',
                    user: user._id,
                    flat: flat._id,
                    time: new Date().valueOf().toString(),
                    val: 100
                }).save();
                new db.models.msg({
                    from: user._id,
                    to: 'admins',
                    time: 1359312503336,
                    text: 'Привет, это тестовое сообщение!',
                    type: 'msg'
                }).save(function (err, msg) {
                    new db.models.msg({
                        from: 'admins',
                        to: user._id,
                        time: 1359312509336,
                        text: 'Привет, это ответ на тестовое сообщение!',
                        type: 'msg'
                    }).save();
                });
            });
        });
        new db.models.flat({
            balance: 1000,
            perMonthPayment: 2000,
            number: 2
        }).save(function (err, flat) {
            new db.models.user({
                login: 'ololo',
                password: '132131',
                name: 'Пушкин Александр',
                phone: '89266038201',
                type: 'user',
                _flat: flat._id
            }).save(function(err, user) {
                new db.models.log({
                    type: 'payment',
                    user: user._id,
                    flat: flat._id,
                    time: new Date().valueOf().toString(),
                    val: 200
                }).save(function() {
                    new db.models.log({
                        type: 'payment',
                        user: user._id,
                        flat: flat._id,
                        time: new Date().valueOf().toString(),
                        val: 500
                    }).save();
                });
            });
            new db.models.user({
                login: 'ololo2',
                password: '123',
                name: 'Пушкин Михаил',
                phone: '89260031201',
                type: 'user',
                _flat: flat._id
            }).save(function(err, user) {
                new db.models.log({
                    type: 'payment',
                    user: user._id,
                    flat: flat._id,
                    time: new Date().valueOf().toString(),
                    val: 200
                }).save(function() {
                    new db.models.log({
                        type: 'payment',
                        user: user._id,
                        flat: flat._id,
                        time: new Date().valueOf().toString(),
                        val: 500
                    }).save();
                });
            });

        });
    });
});
