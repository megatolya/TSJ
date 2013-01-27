var api = require('./api'),
    models = require('./db').models,
    async = require('async');

function getDefaults () {
    return {
        //TODO
        i18n: i18n.ru
    };
}
module.exports = {
    checkAdmin : function (req, res, next) {
        next();
    },
    editUser : function (req, res) {
        var id = req.params[0];
        api.user(id, function(err, user){
            if (err) {
                res.render(500);
            }
            res.render('edit-user', {
                data: getDefaults(),
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
                data: getDefaults(),
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
                    data: getDefaults(),
                    tab: 3,
                    flats: flats
                });
            }
        });
    },
    newFlat : function (req, res) {
        res.render('new-flat', {
            data: getDefaults(),
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
                            data: getDefaults(),
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
                data: getDefaults(),
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
                data: getDefaults(),
                tab: 0,
                users: flat.users,
                flat: flat.flat
            });
        });
    },
    createNewUser : function (req, res){
        var newUser = req.body;
        newUser.cash = 0;
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
                data: getDefaults(),
                tab: 4,
                html: html
            });
        });

    },
    adminIm : function (req, res) {
        res.render(404);
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

    }
};