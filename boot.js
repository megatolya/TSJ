require('./lib/i18n-maker').make(function (err, langs) {
    if (!err){
        require('./lib/db').start(function (err) {
            if(!err) {
                require('./lib/app').start(langs);
            } else {
                console.log(err);
            }
        });
    } else {
        console.log('error compiling languages');
    }
});
