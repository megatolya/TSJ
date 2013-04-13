module.exports = {
    encoding: 'utf8',
    host: '127.0.0.1',
    port: 3000,
    lang: 'ru',
    env: function () {
        if (process.env.NODE_ENV) {
            return process.env.NODE_ENV;
        } else {
            process.env.NODE_ENV = 'development';
            return process.env.NODE_ENV;
        }
    },
    dbConnectionStr: (function(){
        return process.env.NODE_ENV == 'production'
            ? 'mongodb://nodejitsu:71149a34ecc5d25a9f382c27b2104e0f@linus.mongohq.com:10068/nodejitsudb7593219962'
            : 'mongodb://localhost/utility'
    })()
};
