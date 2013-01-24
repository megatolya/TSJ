require('../db').start(function (err) {
    if(!err) {
        console.log('db ready');
    } else {
        console.log(err);
    }
});