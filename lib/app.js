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
    .use(express.cookieSession('123'))
    .use(express.bodyParser())
    .use('/static', express.static('static'))
    .get('/', handlers.mobileVerstka)
    .get(/\/api\/(\w*)\/(\w*)/, handlers.api)
    .get('/testdb', handlers.testDb);

exports.start = function (langs) {
    global.i18n = langs;
    server.listen(config.port);
    console.log('Server works at http://%s:%s',config.host, config.port);
};

