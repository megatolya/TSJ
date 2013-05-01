var db = require('../db'),
    logger = require('../logger');

function randomize() {
    return Math.random().toString().replace('.', '0');
}

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
            number: 5
        }).save(function (err, flat) {
            new db.models.month({
                flat: flat._id,
                date: '7-2013',
                paymentList: [
                    {
                       tariff: 0,
                       id: randomize()
                    },
                    {
                        tariff: 3,
                        id: randomize()
                    },
                    {
                        price: 300,
                        text: 'Консьерж',
                        id: randomize()
                    }
                ],
                payed: true
            }).save();
            new db.models.month({
                flat: flat._id,
                date: '8-2013',
                paymentList: [
                    {
                        tariff: 0,
                        id: randomize()
                    },
                    {
                        tariff: 3,
                        id: randomize()
                    },
                    {
                        price: 300,
                        text: 'Консьерж',
                        id: randomize()
                    }
                ],
                payed: false
            }).save();
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
            number: 6
        }).save(function (err, flat) {
            new db.models.month({
                flat: flat._id,
                date: '7-2013',
                paymentList: [
                    {
                        tariff: 1,
                        id: randomize()
                    },
                    {
                        tariff: 2,
                        id: randomize()
                    },
                    {
                        price: 300,
                        text: 'Консьерж',
                        id: randomize()
                    }
                ],
                payed: false
            }).save();
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
    new db.models.flat({
        balance: 230,
        number: 7
    }).save(function (err, flat) {
        new db.models.month({
            flat: flat._id,
            date: '7-2013',
            paymentList: [
                {
                    tariff: 1,
                    id: randomize()
                },
                {
                    tariff: 2,
                    id: randomize()
                },
                {
                    price: 300,
                    text: 'Консьерж',
                    id: randomize()
                }
            ],
            payed: true
        }).save();
        new db.models.month({
            flat: flat._id,
            date: '8-2013',
            paymentList: [
                {
                    tariff: 1,
                    id: randomize()
                },
                {
                    tariff: 2,
                    id: randomize()
                },
                {
                    price: 300,
                    text: 'Консьерж',
                    id: randomize()
                }
            ],
            payed: true
        }).save();
        new db.models.month({
            flat: flat._id,
            date: '9-2013',
            paymentList: [
                {
                    tariff: 1,
                    id: randomize()
                },
                {
                    tariff: 2,
                    id: randomize()
                },
                {
                    price: 300,
                    text: 'Консьерж',
                    id: randomize()
                }
            ],
            payed: false
        }).save();
        new db.models.user({
            login: 'useruser',
            password: '123',
            name: 'Владимир Кремниев',
            phone: '1231231321',
            type: 'user',
            _flat: flat._id
        }).save(function (err, user) {
            new db.models.log({
                type: 'payment',
                user: user._id,
                flat: flat._id,
                time: new Date().valueOf().toString(),
                val: 500
            }).save();
            new db.models.msg({
                from: user._id,
                to: 'admins',
                time: 1359312503336,
                text: 'Привет, это тестовое сообщение 2!',
                type: 'msg'
            }).save(function (err, msg) {
                new db.models.msg({
                    from: 'admins',
                    to: user._id,
                    time: 1359312509336,
                    text: 'Привет, это ответ на тестовое сообщение2!',
                    type: 'msg'
                }).save();
            });
        });
    });
    new db.models.flat({
        balance: 2000,
        number: 8
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
            login: 'yauser',
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
