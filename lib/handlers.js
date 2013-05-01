var api = require('./api'),
    fs = require('fs'),
    models = require('./db').models,
    async = require('async');

Date.prototype.daysInMonth = function() {
    var now = new Date();
    return new Date(now.getMonth(), now.getFullYear(), 0).getDate();
};
Date.prototype.format = function() {
    return this.getDate()
            + '.' + (this.getMonth()+1 < 10 ? '0' + (this.getMonth()+1) : (this.getMonth()+1))
            + '.' + this.getFullYear()
            + ' ' + this.getHours()
            + ':' + (this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes());
};

function getDefaults (req) {
    var lang = 'ru';
    return {
        i18n: i18n[lang],
        lang: lang,
        user: req.session,
        referer: req.header('Referer'),
        dayPast: new Date().daysInMonth() - new Date().getDate()
    };
}

function parsePayment (month) {
    var date = month.date.split('-');
    return {
        month: date[0],
        year: date[1],
        payed: month.payed,
        id: month._id
    };
}

// TODO handle error
// TODO logs

module.exports = {

    checkAdmin: function (req, res, next) {
        if (req.session.login && req.session.type == 'admin') {
            models.user.findById(req.session._id, function (err, user) {
                if (!err && user && user.type == 'admin')
                    next();
                else
                    res.redirect('/login');
            });
        } else {
            res.redirect('/login');
        }

    },

    checkUser: function (req, res, next) {
        if (req.session.login && req.session.type == 'user') {
            models.user.findById(req.session._id, function (err, user) {
                if (!err && user && user.type == 'user')
                    next();
                else
                    res.redirect('/login');
            });
        } else {
            res.redirect('/login');
        }
    },

    login: function (req, res) {
        res.render('ios-login', {
            data: getDefaults(req)
        });
    },

    checkLogin: function (req, res) {
        models.user.findOne({
            login: req.body.login,
            password: req.body.password
        }, function (err, user) {
            if (err) {
                res.render(500);
            }
            if (user) {
                req.session = user;
                if (user.type == 'user') {
                    res.redirect('/');
                } else {
                    res.redirect('/admin/');
                }
            } else {
                res.redirect('/login?z=err');
            }
        });
    },

    mainPage: function (req, res) {
        models.flat.findById(req.session._flat, function(err, flat) {
            res.render('ios-main', {
                flat: flat,
                data : getDefaults(req)
            });
        });
    },

    editUser: function (req, res) {
        var id = req.params[0];
        api.user(id, function(err, user){
            if (err)
                return res.render(500);

            res.render('edit-user', {
                data: getDefaults(req),
                tab: 3,
                user: user.user,
                flat: user.flat
            });
        });
    },

    payments: function (req, res) {
        var id = req.session._id;
        api.user(id, function(err, user){
            if (err)
                return res.render(500);

            models.month.find({flat: user.user._flat}, function (err, months) {
                var totalPaymentList = months.map(function (month) {
                    return parsePayment(month);
                });

                res.render('ios-payments', {
                    data: getDefaults(req),
                    list: totalPaymentList
                });
            });
        });

    },

    changePaymentVal: function (req, res) {
        models.month.findById(req.body.payment, function (err, payment) {
            var newList = [];

            payment.paymentList.forEach(function (pay) {
                var newObj = {};

                // FIXME
                if (pay.tariff != undefined)
                    newObj.tariff = pay.tariff;

                newObj.value = pay.id == req.body.id ? req.body.newVal : (pay.value || undefined);
                if (pay.id)
                    newObj.id = pay.id;
                if (pay.price)
                    newObj.price = pay.price;
                if (pay.text)
                    newObj.text = pay.text;

                newList.push(newObj);
            });


            payment.paymentList = newList;
            payment.save(function (err) {
                if (err)
                    return res.send(500);

                res.status(200).end();
            });
        });
    },

    editFlat: function (req, res) {
        var id = req.params[0];
        api.flat(id, function(err, flat){
            if (err) {
                return res.render(500);
            }
            res.render('edit-flat', {
                data: getDefaults(req),
                tab: 0,
                flat: flat.flat,
                users: flat.users
            });
        });
    },

    saveUser: function (req, res) {
        var edittedUser = req.body;
        models.user.findOne(edittedUser._id, function(err, user){
            for (k in edittedUser) {
                if (k == '_id') continue;
                user[k] = edittedUser[k];
            }
            user.save(function (err) {
                if (err) {
                    res.send(500);
                } else {
                    res.redirect('/admin/account/' + user._id);
                }
            });
        });
    },

    saveFlat: function (req, res) {
        var edittedFlat = req.body;
        models.flat.findOne(edittedFlat._id, function(err, flat){
            for (k in edittedFlat) {
                if (k == '_id') continue;
                flat[k] = edittedFlat[k];
            }
            flat.save(function (err) {
                if (err) {
                    res.send(500);
                } else {
                    res.redirect('/admin/flat/' + flat._id);
                }
            });
        });
    },

    newUser: function (req, res) {
        models.flat.find(function (err, flats) {
            if (err) {
                res.send(500);
            } else {
                res.render('new-user', {
                    data: getDefaults(req),
                    tab: 3,
                    flats: flats
                });
            }
        });
    },

    newFlat: function (req, res) {
        res.render('new-flat', {
            data: getDefaults(req),
            tab: 0
        });
    },

    mobileVerstka: function (req, res) {
        res.render('mobileVerstka');
    },

    adminAccounts: function (req, res) {
        models.flat.find(function (err, flats) {
            if (err)
                return res.send(500);

            var tasks = [];
            flats.forEach(function (flat) {
                tasks.push(function (callback) {
                    api.flat(flat._id, function (err, flat) {
                        if (err) {
                            res.send(500);
                        } else {
                            callback(null, flat);
                        }
                    });
                });
            });
            async.parallel(tasks, function (err, result) {
                if (err) {
                    res.render(500);
                } else {
                    res.render('admin-accounts', {
                        data: getDefaults(req),
                        tab: 3,
                        flats: result
                    });
                }
            });
        });
    },

    account: function (req, res) {
        var id = req.params[0];
        api.user(id, function(err, user){
            if (err)
                return res.render(500);

            res.render('account', {
                data: getDefaults(req),
                tab: 3,
                user: user.user,
                flat: user.flat
            });
        });
    },

    flat: function (req, res) {
        var id = req.params[0];
        api.flat(id, function(err, flat){
            if (err)
                return res.render(500);

            res.render('flat', {
                data: getDefaults(req),
                tab: 0,
                users: flat.users,
                flat: flat.flat
            });
        });
    },

    userPayment: function (req, res) {
        var monthPaymentId = req.params[0];
        api.month(monthPaymentId, function (err, payment) {
            res.render('ios-payment', {
                data: getDefaults(req),
                payment: payment.month,
                flat: payment.flat,
                users: payment.users,
                sum: payment.sum,
                fullPaymentList: payment.fullPaymentList,
                id: payment.month._id
            });
        });
    },

    generateUserPayment: function (req, res) {
        var monthPaymentId = req.params[0];
        api.month(monthPaymentId, function (err, payment) {
            res.render('plain-payment', {
                data: getDefaults(req),
                payment: payment.month,
                flat: payment.flat,
                users: payment.users,
                sum: payment.sum,
                fullPaymentList: payment.fullPaymentList
            });
        });
    },

    createNewUser: function (req, res){
        var newUser = req.body;
        new models.user(newUser).save(function (err, copy) {
            if (err) {
                res.render(500);
            }
            res.redirect('/admin/account/' + copy._id);
        });
    },

    createNewFlat: function (req, res){
        var newFlat = req.body;
        newFlat.balance = 0;
        new models.flat(newFlat).save(function (err, copy) {
            if (err) {
                res.render(500);
            }
            res.redirect('/admin/flat/' + copy._id);
        });
    },

    removeUser: function (req, res) {
        var id = req.params[0];

        models.user.findByIdAndRemove(id, function (err) {
            res.redirect('/admin/manage-accounts');
        });
    },

    removeFlat: function (req, res) {
        var id = req.params[0];

        models.flat.findByIdAndRemove(id, function (err) {
            if (err) {
                res.render(500);
            }
            models.user.find({_flat:id}, function (err, users) {
                if (err) {
                    res.render(500);
                }
                users.forEach(function (user) {
                    user.remove();
                });
            });
            res.redirect('/admin/manage-accounts');
        });
    },

    about: function (req, res) {
        var md = require('node-markdown').Markdown,
            fs = require('fs');

        fs.readFile('./about.md', 'utf8', function (err, text) {
            var html = md(text);
            res.render('about', {
                data: getDefaults(req),
                tab: 4,
                html: html
            });
        });

    },

    adminIm: function (req, res) {
        models.msg.find({to: 'admins'}, function(err, newMsgs) {
            if (err)
                { res.render(500);  } else {
                var msgs = newMsgs.length ? newMsgs : [];
                models.msg.find({from: 'admins'}, function(err, fromMsgs) {
                    if (err) {
                        res.render(500);
                    } else {
                        fromMsgs.forEach(function(msg) {
                            msgs.push(msg);
                        });
                        msgs.sort(function(a, b) {return b.time - a.time});
                        var tasks = [];
                        msgs.forEach(function(msg) {
                            tasks.push(function(callback) {
                                models.user.findById(msg.from === 'admins' ? msg.to : msg.from, function(err, user) {
                                    callback(null, { msg: msg, user: user, date: new Date(+msg.time).format() });
                                });
                            });
                        });
                        async.parallel(tasks, function(err, msgs) {
                            res.render('admin-im', {
                                data: getDefaults(req),
                                tab: 1,
                                msgs: msgs
                            });
                        });
                    }
                });
            }
        });
    },

    adminAjaxPayments: function (req, res) {
        models.flat.find(function(err, flats) {
            if (err) {
                res.render(500);
            } else {
                res.send({
                    data: getDefaults(req),
                    tab: 2,
                    flats: flats
                });
            }
        });
    },

    adminPayments: function (req, res) {
        models.flat.find(function(err, flats) {
            if (err) {
                res.render(500);
            } else {
                fs.readFile('last_payment', 'utf8', function (err, text) {
                    if (err) res.status(500).end();
                    if (text.trim() != '') {
                        text = new Date(+text).format();
                    } else {
                        text = getDefaults(req).i18n['never'];
                    }
                    res.render('admin-payments', {
                        data: getDefaults(req),
                        last_update: text,
                        tab: 2,
                        flats: flats
                    });
                });
            }
        });
    },

    testDb: function (req, res) {
        models.user.find(function (err, men) {
            if (!err)
                res.send('ok!');
            else
                res.send('not ok! :-(');
        });
    },

    api: function (req, res) {
        var model = req.params[0],
            id = req.params[1];

        api[model](id, function (err, doc) {
            if (err) {
                res.render(500);
            }
            res.send(doc);
        });
    },

    settings: function (req, res) {
        res.render('ios-settings', {
            user: req.session,
            data : getDefaults(req)
        });
    },

    im: function (req, res) {
        models.msg.find({from: req.session._id}, function (err, froms) {
            models.msg.find({to: req.session._id}, function (err, tos) {
                var msgs = froms;
                tos.forEach(function (to) {
                    msgs.push(to);
                });
                msgs.sort(function(a, b){ return parseInt(b.time) - parseInt(a.time) });
                var ims = [];
                msgs.forEach(function (msg) {
                    var time = new Date(+msg.time).format();
                    var obj = {
                        text: msg.text,
                        from: msg.from === 'admins' ? 'from-admin' : 'from-me',
                        to: msg.to === 'admins' ? 'to-admin' : 'to-me',
                        time: time
                    };
                    ims.push(obj);
                });
                res.render('ios-im', {
                    data: getDefaults(req),
                    msgs: ims
                });
            });
        });

    },

    adminNewMsg: function(req, res) {
        var idMsg = req.body.idMsg;
        models.msg.findById(idMsg, function(err, msg) {
            new models.msg({
                from: 'admins',
                to: msg.from,
                time: new Date().valueOf(),
                text: req.body.text,
                type: 'msg'
            })
                .save(function(err, copy) {
                    res.send(copy);
                });
        });
    },

   imNewMsg : function(req, res) {
      new models.msg({
            from: req.session._id,
            to: 'admins',
            time: new Date().valueOf(),
            text: req.body.msg,
            type: req.body.type
      }).save(function(err, copy) {
        res.redirect('/im');
      });
    },

    logout : function (req, res) {
        req.session = {};
        res.redirect('/login?z=logout');
    },

    ajaxIm: function(req, res) {
        models.msg.find({to: 'admins'}, function(err, newMsgs) {
            if (err)
                return res.render(500);
            var msgs = newMsgs.length ? newMsgs : [];
            models.msg.find({from: 'admins'}, function(err, fromMsgs) {
                if (err)
                    return res.render(500);

                fromMsgs.forEach(function(msg) {
                    msgs.push(msg);
                });
                msgs.sort(function(a, b) {return b.time - a.time});
                var tasks = [];
                msgs.forEach(function(msg) {
                    tasks.push(function(callback) {
                        models.user.findById(msg.from === 'admins' ? msg.to : msg.from, function(err, user) {
                            if (err) callback(err);

                            callback(null, { msg: msg, user: user, date: new Date(+msg.time).format() });
                        });
                    });
                });
                async.parallel(tasks, function(err, msgs) {
                    res.send({
                        data: getDefaults(req),
                        tab: 1,
                        msgs: msgs
                    });
                });
            });
        });
    },

    pay: function(req, res) {
        var pay = req.params[0];
        models.flat.findById(req.session._flat, function(err, flat) {
            flat.balance = flat.balance + parseFloat(pay);
            flat.save(function(err, copy) {
                new models
                    .log({
                        type: 'payment',
                        user: req.session._id,
                        flat: flat._id,
                        time: new Date().valueOf(),
                        val: pay
                    })
                        .save(function(err, copy) {
                            res.status(200).end();
                        });
            });
        });
    },

    paymentHistory: function(req, res) {
        var flatId = req.params[0];
        models.log.find({flat: flatId}, function(err, logs) {
            var tasks = [];
            logs.forEach(function(log) {
                tasks.push(function(callback) {
                    models.user.findById(log.user, function(err, user) {
                        if (err) return callback(err);
                        models.flat.findById(log.flat, function(err, flat) {
                            if (err) return callback(err);
                            callback(null, { log: log, user: user, flat: flat, date: new Date(+log.time).format()});
                        });
                    });
                });
            });
            async.parallel(tasks, function(err, logs) {
                logs.sort(function(a, b) {return b.log.time - a.log.time});
                res.render('admin-payment-history', {
                    data : getDefaults(req),
                    tab: 2,
                    logs : logs
                });
            });

        });
    },

    saveSettings: function(req, res) {
        req.session.phone = req.body.phone;
        req.session.name = req.body.name;
        models.user.findById(req.session._id, function(err, user) {
            if (err) return res.render(500)

            user.phone = req.body.phone;
            user.name = req.body.name;
            user.save(function(err, copy) {
                res.redirect('/');
            });
        });
    },

    imAjax : function (req, res) {
        models.msg.find({from: req.session._id}, function (err, froms) {
            models.msg.find({to: req.session._id}, function (err, tos) {
                var msgs = froms;
                tos.forEach(function (to) {
                    msgs.push(to);
                });
                msgs.sort(function(a, b){ return parseInt(b.time) - parseInt(a.time) });
                var ims = [];
                msgs.forEach(function (msg) {
                    var time = new Date(+msg.time).format(),
                        obj = {
                        text: msg.text,
                        from: msg.from === 'admins' ? 'from-admin' : 'from-me',
                        to: msg.to === 'admins' ? 'to-admin' : 'to-me',
                        time: time
                    };
                    ims.push(obj);
                });
                res.send({
                    data: getDefaults(req),
                    msgs: ims
                });
            });
        });

    },

    spisat: function(req, res) {
        models.flat.find(function(err, flats) {
            var tasks = [],
                time = new Date().valueOf();

            flats.forEach(function(flat) {
                tasks.push(function(callback) {
                    // FIXME
                    flat.balance = flat.balance - 1;
                    flat.save(function(err, copy) {
                        new models.log({
                                type: 'spisat',
                                user: null,
                                flat: flat._id,
                                time: time
                            })
                            .save(function(err, copy) {
                                callback(null);
                            });
                    });
                });
            });
            async.parallel(tasks, function (err) {
                fs.writeFile('last_payment', new Date().valueOf().toString(), function (err) {
                    res
                        .status(200)
                        .end();
                    });
                });
        });
    },

    neighbours : function (req, res) {
        var neighbours = [];

        models.user.find(function(err, users) {
            users.forEach(function(user) {
                if (user.type != 'admin' && user._id != req.session._id) {
                    neighbours.push(user);
                };
            });
            var tasks = [];

            neighbours.forEach(function (user) {
                tasks.push(function(callback){
                    models.flat.findById(user._flat, function(err, flat){
                        if (err)
                            return callback(err);

                        callback(null, { user: user, flat: flat });
                    });
                });
            });
            async.parallel(tasks, function (err, users) {
                if (err) return res.render(500);

                users.sort(function(a, b){return b.flat.number - a.flat.number;});
                res.render('ios-neighbours' , {
                    data: getDefaults(req),
                    users: users
                });
            });
        });
    },

    dbAll : function(req, res) {
        res.render('db', {
            data: getDefaults(req),
            tab: 5
        });
    },

    db: function(req, res) {
        var table = req.params[0];
        table = table.slice(0, table.length - 1);
        logger.error(table);
        models[table].find(function(err, items) {
            res.send({ items: items, table: table });
        });
    },

    dbSave: function(req, res) {
        models[req.body.table].findById(req.body.id, function(err, model) {
            model[req.body.key] = req.body.value;
            model.save(function(err, copy) {
                res.send(req.body);
            });
        });
    }
};

