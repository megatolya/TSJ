var api = require('./api'),
    models = require('./db').models,
    async = require('async');

function getDefaults (req) {
    var lang = 'ru';
    return {
        i18n: i18n[lang],
        lang: lang,
        user: req.session,
        referer: req.header('Referer'),
        msgTypes: {
            msg: {ru: '', en: ''},
            locksmith: {
                ru: 'Вызвать слесаря',
                en: 'Call locksmith'
            },
            electrician: {
                ru: 'Вызвать электрика',
                en: 'Call electrician'
            },
            'from-admin': { ru: 'от администратора', en: 'from administrator' },
            'from-me': { ru: 'от меня', en: 'from me' }
        }
    };
}
module.exports = {
    checkAdmin : function (req, res, next) {
        if (req.session.login && req.session.type == 'admin') {
            next();
        } else {
            res.redirect('/login');
        }

    },
    checkUser : function (req, res, next) {
        if (req.session.login && req.session.type == 'user') {
            next();
        } else {
            res.redirect('/login');
        }
    },
    login : function (req, res) {
        res.render('ios-login', {
            data: getDefaults(req)
        });
    },
    checkLogin : function (req, res) {
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
    mainPage : function (req, res) {
        res.render('ios-main', {
            data: getDefaults(req)
        });
    },
    editUser : function (req, res) {
        var id = req.params[0];
        api.user(id, function(err, user){
            if (err) {
                res.render(500);
            }
            res.render('edit-user', {
                data: getDefaults(req),
                tab: 3,
                user: user.user,
                flat: user.flat
            });
        });
    },
    editFlat : function (req, res) {
        var id = req.params[0];
        api.flat(id, function(err, flat){
            if (err) {
                res.render(500);
            }
            res.render('edit-flat', {
                data: getDefaults(req),
                tab: 0,
                flat: flat.flat,
                users: flat.users
            });
        });
    },
    saveUser : function (req, res) {
        var edittedUser = req.body;
        models.user.findOne(edittedUser._id, function(err, user){
            for (k in edittedUser) {
                if (k == '_id') continue;
                user[k] = edittedUser[k];
            }
            user.save(function (err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else {
                    res.redirect('/admin/account/' + user._id);
                }
            });
        });
    },
    saveFlat : function (req, res) {
        var edittedFlat = req.body;
        models.flat.findOne(edittedFlat._id, function(err, flat){
            for (k in edittedFlat) {
                if (k == '_id') continue;
                flat[k] = edittedFlat[k];
            }
            flat.save(function (err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else {
                    res.redirect('/admin/flat/' + flat._id);
                }
            });
        });
    },
    newUser : function (req, res) {
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
    newFlat : function (req, res) {
        res.render('new-flat', {
            data: getDefaults(req),
            tab: 0
        });
    },
    mobileVerstka : function (req, res) {
        res.render('mobileVerstka');
    },
    adminAccounts : function (req, res) {
        models.flat.find(function (err, flats) {
            if (err) {
                res.send(500);
            } else {
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
                        console.log(result);
                        res.render('admin-accounts', {
                            data: getDefaults(req),
                            tab: 3,
                            flats: result
                        });
                    }
                });
            }
        });
    },
    account : function (req, res) {
        var id = req.params[0];
        api.user(id, function(err, user){
            if (err) {
                res.render(500);
            }
            res.render('account', {
                data: getDefaults(req),
                tab: 3,
                user: user.user,
                flat: user.flat
            });
        });
    },
    flat : function (req, res) {
        var id = req.params[0];
        api.flat(id, function(err, flat){
            if (err) {
                res.render(500);
            }
            res.render('flat', {
                data: getDefaults(req),
                tab: 0,
                users: flat.users,
                flat: flat.flat
            });
        });
    },
    createNewUser : function (req, res){
        var newUser = req.body;
        new models.user(newUser).save(function (err, copy) {
            if (err) {
                res.render(500);
            }
            res.redirect('/admin/account/' + copy._id);
        });
    },
    createNewFlat : function (req, res){
        var newFlat = req.body;
        newFlat.balance = 0;
        new models.flat(newFlat).save(function (err, copy) {
            if (err) {
                res.render(500);
            }
            res.redirect('/admin/flat/' + copy._id);
        });
    },
    removeUser : function (req, res) {
        var id = req.params[0];

        models.user.findByIdAndRemove(id, function (err) {
            res.redirect('/admin/manage-accounts');
        });
    },
    removeFlat : function (req, res) {
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
    about : function (req, res) {
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
    adminIm : function (req, res) {
        models.msg.find({to: 'admins'}, function(err, newMsgs) {
            if (err) { res.render(500); return; }
            var tasks = [];
            newMsgs.forEach(function(newMsg) {
                tasks.push(function(callback) {
                    var obj = {msg : newMsg};
                    models.user.findById(newMsg.from, function(err, user) {
                        if (err) callback (err);
                        else {
                            obj.user = user;
                            callback(null, obj);
                        }
                    });
                });
                async.parallel(tasks, function(err, msgs) {
                    if (err) {
                        res.render(500);
                    } else {
                        console.log(msgs);
                        res.render('admin-im', {
                            data: getDefaults(req),
                            msgs: msgs,
                            tab: 1
                        });
                    }
                });
            });
            if (newMsgs.length === 0) {
                res.render('admin-im', {
                    data: getDefaults(req),
                    msgs: null,
                    tab: 1
                });
            }
        });
    },
    adminPayments : function (req, res) {
        res.render(404);
    },
    testDb : function (req, res) {
        models.user.find(function (err, men) {
            if (!err)
                res.send('ok!');
            else
                res.send('not ok! :-(');
        });
    },
    api : function (req, res) {
        var model = req.params[0],
            id = req.params[1];

        api[model](id, function (err, doc) {
            if (err) {
                console.log(err);
                res.render(500);
            }
            res.send(doc);
        });
    },
    settings : function (req, res) {
        res.render('ios-settings', {
            data : getDefaults(req)
        });
    },
    im : function (req, res) {
        models.msg.find({from: req.session._id}, function (err, froms) {
            models.msg.find({to: req.session._id}, function (err, tos) {
                var msgs = froms;
                tos.forEach(function (to) {
                    msgs.push(to);
                });
                msgs.sort(function(a, b){ return parseInt(a.time) - parseInt(b.time) });
                var ims = [];
                msgs.forEach(function (msg) {
                    var time = new Date(+msg.time);
                    var obj = {
                        text: time + ' - ' + msg.text,
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
        console.log(req.body);
        res.send(req.body);
    },
   imNewMsg : function(req, res) {
      new models.msg({
            from: req.session._id,
            to: 'admins',
            time: new Date().valueOf(),
            text: req.body.msg,
            type: req.body.type
      }).save(function(err, copy) {
            console.log('save');
            console.log(copy);
      });
      res.redirect('/im');
    },
    balance : function (req, res) {
        models.flat.findById(req.session._flat, function(err, flat) {
            res.render('ios-balance', {
                flat: flat,
                cash: req.session.cash,
                data : getDefaults(req),
                dayPast: 31 - new Date().getDate()
            });
        });
    },
    logout : function (req, res) {
        req.session = {};
        res.redirect('/login?z=logout');
    },
    ajaxIm: function(req, res) {
        models.msg.find({to: 'admins'}, function(err, newMsgs) {
            if (err) { res.render(500); return; }
            var tasks = [];
            newMsgs.forEach(function(newMsg) {
                tasks.push(function(callback) {
                    var obj = {msg : newMsg};
                    models.user.findById(newMsg.from, function(err, user) {
                        if (err) callback (err);
                        else {
                            obj.user = user;
                            callback(null, obj);
                        }
                    });
                });
                async.parallel(tasks, function(err, msgs) {
                    if (err) {
                        res.render(500);
                    } else {
                        console.log(msgs);
                        res.render('admin-ajax-im', {
                            data: getDefaults(req),
                            msgs: msgs
                        });
                    }
                });
            });
            if (newMsgs.length === 0) {
                res.render('admin-ajax-im', {
                    data: getDefaults(req),
                    msgs: null
                });
            }
        });
    },
    pay: function(req, res) {
        var pay = req.params[0];
        models.flat.findById(req.session._flat, function(err, flat) {
            flat.balance = flat.balance + parseFloat(pay);
            flat.save(function(err, copy) {
                res.redirect('/balance');
            });
        });
    }
};

