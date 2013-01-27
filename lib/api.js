var db = require('./db'),
    $ = require('jquery'),
    async = require('async');

module.exports = {
    user : function (id, callback) {
        db.models.user.findById(id, function (err, man) {
            if (err) {
                callback(new Error());
                return;
            }
            db.models.flat.findById(man._flat, function (err, flat) {
                if (err) {
                    callback(new Error());
                    return;
                }

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
            if (err) {
                callback(new Error());
                return;
            }
            callback(null, {
                admin: admin
            });
        });
    },
    flat : function (id, callback) {
        db.models.flat.findById(id, function (err, flat) {
            if (err) {
                callback(new Error());
                return;
            }
            var obj = { flat: flat },
                tasks = [];

            db.models.user.find({_flat: id}, function (err, usersFromFlat) {
                usersFromFlat.forEach(function (userFromFlat) {
                    tasks.push(function (callback) {
                        db.models.user.findById(userFromFlat._id, function (err, user) {
                            if (err) {
                                callback(new Error());
                                return;
                            }
                            callback(null, user);
                        });
                    });
                });
                async.parallel(tasks, function (err, users) {
                    if (!err){
                        obj.users = users;
                        callback(null, obj);
                    }
                    else{
                        callback(new Error());
                    }
                });
            });
        });
    }
};