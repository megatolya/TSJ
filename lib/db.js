var mongoose = require('mongoose'),
    dbName = require('./config').dbName;

mongoose.connect('mongodb://localhost/' + dbName);
var manSchema = mongoose.Schema({
        login: String,
        password: String,
        name: String,
        phone: String,
        info: Object,
        _flat: String,
        type: String
    }),
    flatSchema = mongoose.Schema({
        balance: Number,
        number: Number
    }),
    logSchema = mongoose.Schema({
        type: String,
        info: Object
    }),
    msgSchema = mongoose.Schema({
        from: String,
        to: String,
        time: String,
        text: String,
        type: String
    });

var user = mongoose.model('user', manSchema),
    Flat = mongoose.model('Flat', flatSchema),
    Log = mongoose.model('Log', logSchema);
    Msg = mongoose.model('Msg', msgSchema);

module.exports = {
    start : function (callback) {
        var db = mongoose.connection;
        db.on('error', function () {
            callback(new Error('no connection'));
        });
        db.once('open', function () {
            callback(null);
        });
    },
    models : {
        user : user,
        flat: Flat,
        log: Log,
        msg: Msg
    }
};


