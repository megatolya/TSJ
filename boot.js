require('./lib/i18n-maker').make(function (langs) {
    require('./lib/app').start(langs);
});
