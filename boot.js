var logger = require('./lib/logger');

require('./lib/i18n-maker').make(function (err, langs) {
    if (!err){
        require('./lib/db').start(function (err) {
            if(!err) {
                require('./lib/app').start(langs);
            } else {
                logger.error(err);
            }
        });
    } else {
        logger.error('Error compiling languages');
    }
});
