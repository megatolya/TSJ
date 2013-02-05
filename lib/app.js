var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    config = require('./config');
    handlers = require('./handlers');
app
    .set('views',__dirname + '/../views')
    .set('view engine', 'jade')
    .use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }))
    .use(function(req, res, next){
        console.log('%s %s', req.method, req.url);
        next();
    })
    .use(express.cookieParser('0'))
    .use(express.cookieSession('0'))
    .use(express.bodyParser())
    .use('/static', express.static('static'))
    .get('/', handlers.checkUser, handlers.mainPage)
    .get('/settings', handlers.checkUser, handlers.settings)
    .post('/settings', handlers.checkUser, handlers.saveSettings)
    .get(/\/pay\/(.+)/, handlers.checkUser, handlers.pay)
    .get(/\/admin\/payment-history\/(\w+)/, handlers.checkAdmin, handlers.paymentHistory)
    .get('/im', handlers.checkUser, handlers.im)
    .get('/im-ajax', handlers.checkUser, handlers.imAjax)
    .post('/im', handlers.checkUser, handlers.imNewMsg)
    .get('/logout', handlers.logout)
    .get('/login', handlers.login)
    .post('/login', handlers.checkLogin)
    .get('/admin', handlers.checkAdmin, handlers.adminIm)
    .get('/admin/im', handlers.checkAdmin, handlers.adminIm)
    .get('/spisat', handlers.checkAdmin, handlers.spisat)
    .get('/admin/payments', handlers.checkAdmin, handlers.adminPayments)
    .get('/admin/ajax-payments', handlers.checkAdmin, handlers.adminAjaxPayments)
    .get('/admin/manage-accounts', handlers.checkAdmin, handlers.adminAccounts)
    .get(/\/admin\/remove-user\/(\w*)/, handlers.checkAdmin, handlers.removeUser)
    .get(/\/admin\/remove-flat\/(\w*)/, handlers.checkAdmin, handlers.removeFlat)
    .get('/admin/manage-accounts/new-user', handlers.checkAdmin, handlers.newUser)
    .get('/admin/manage-accounts/new-flat', handlers.checkAdmin, handlers.newFlat)
    .get(/\/admin\/edit-flat\/(\w*)/, handlers.checkAdmin, handlers.editFlat)
    .post(/\/admin\/edit-flat/, handlers.checkAdmin, handlers.saveFlat)
    .get(/\/admin\/edit-user\/(\w*)/, handlers.checkAdmin, handlers.editUser)
    .post(/\/admin\/edit-user/, handlers.checkAdmin, handlers.saveUser)
    .post('/admin/manage-accounts/new-user', handlers.checkAdmin, handlers.createNewUser)
    .post('/admin/manage-accounts/new-flat', handlers.checkAdmin, handlers.createNewFlat)
    .get(/\/admin\/account\/(\w*)/, handlers.checkAdmin, handlers.account)
    .get(/\/admin\/flat\/(\w*)/, handlers.checkAdmin, handlers.flat)
    .get(/\/api\/(\w*)\/(\w*)/, handlers.api)
    .get('/about', handlers.about)
    .post('/admin/msg', handlers.checkAdmin, handlers.adminNewMsg)
    .get('/admin/msgs', handlers.checkAdmin, handlers.ajaxIm)
    .get('/testdb', handlers.testDb);

exports.start = function (langs) {
    global.i18n = langs;
    server.listen(config.port);
    console.log('Server works at http://%s:%s',config.host, config.port);
};

