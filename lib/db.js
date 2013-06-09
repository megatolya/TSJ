var mongoose = require('mongoose'),
    dbConnectionStr = require('./config').dbConnectionStr,
    logger = require('./logger');

mongoose.connect(dbConnectionStr);
var manSchema = mongoose.Schema({
        login: String,
        password: String,
        name: String,
        phone: String,
        _flat: String,
        type: String
    }),
    flatSchema = mongoose.Schema({
        balance: Number,
        number: Number
    }),
    logSchema = mongoose.Schema({
        type: String,
        user: String,
        flat: String,
        time: String,
        val: String
    }),
    msgSchema = mongoose.Schema({
        from: String,
        to: String,
        time: String,
        text: String,
        type: String,
        status: String
    }),
    monthSchema = mongoose.Schema({
        flat: String,
        date: String,
        paymentList: Object,
        payed: Boolean
    });

var user = mongoose.model('user', manSchema),
    Flat = mongoose.model('Flat', flatSchema),
    Log = mongoose.model('Log', logSchema);
    Msg = mongoose.model('Msg', msgSchema);
    Month = mongoose.model('Month', monthSchema);

module.exports = {
    start : function (callback) {
        logger.info('Creating connection to database');
        var db = mongoose.connection;
        db.on('error', function () {
            callback(new Error('No connection'));
        });
        db.once('open', function () {
            callback(null);
        });
    },
    models : {
        user : user,
        flat: Flat,
        log: Log,
        msg: Msg,
        month: Month
    }
};
