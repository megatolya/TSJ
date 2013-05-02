var db = require('./db'),
    async = require('async'),
    tarifficator = require('./tariff');

var api = {
    user : function (id, callback) {
        db.models.user.findById(id, function (err, man) {
            if (err)
                return callback(err);

            api.flat(man._flat, function (err, flat) {
                if (err)
                    return callback(err);

                var obj = {
                    user: man,
                    flat: flat
                };

                callback(null, obj);
            });
        });
    },

    admin : function (id, callback) {
        db.models.admin.findById(id, function (err, admin) {
            if (err)
                return callback(err);

            callback(null, {
                admin: admin
            });
        });
    },

    flat : function (id, callback) {
        db.models.flat.findById(id, function (err, flat) {
            if (err)
                return callback(err);

            var obj = { flat: flat },
                tasks = [];

            db.models.user.find({_flat: id}, function (err, usersFromFlat) {
                usersFromFlat.forEach(function (userFromFlat) {
                    tasks.push(function (callback) {
                        db.models.user.findById(userFromFlat._id, function (err, user) {
                            if (err)
                                return callback(err);

                            callback(null, user);
                        });
                    });
                });
                async.parallel(tasks, function (err, users) {
                    if (!err) {
                        obj.users = users;
                        callback(null, obj);
                    } else {
                        callback(err);
                    }
                });
            });
        });
    },

    month: function (id, callback) {
        db.models.month.findById(id, function (err, month) {
            if (err)
                return callback(err);

            var fullPaymentList = month.paymentList.map(function (payment) {
                if (payment.tariff !== undefined) {
                    var tariff = tarifficator(payment.tariff);
                    tariff.value = payment.value || 0;
                    tariff.id = payment.id;
                    tariff.sum = tariff.valuable ? tariff.value * tariff.price : tariff.price;
                    return tariff;
                } else {
                    return {
                        name: payment.text,
                        valuable: false,
                        value: null,
                        price: payment.price,
                        sum: payment.price,
                        id: payment.id,
                    };
                }
            });

            var sum = 0;

            fullPaymentList.forEach(function (payment) {
                if (payment.valuable)
                    sum += (payment.value || 0) * payment.price
                else
                    sum += payment.price;
            });

            api.flat(month.flat, function (err, flat) {
                if (err)
                    return callback(err);

                callback(null, {
                    flat: flat,
                    month: month,
                    fullPaymentList: fullPaymentList,
                    sum: sum,
                    date: month.date
                });
            });
        });
    }
};

module.exports = api;
