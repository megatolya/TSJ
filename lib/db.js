var mongoose = require('mongoose'),
    dbName = require('./config').dbName;

mongoose.connect('mongodb://localhost/' + dbName);
var manSchema = mongoose.Schema({
        login: String,
        password: String,
        name: String,
        cash: Number,
        info: Object,
        _flat: String
    }),
    flatSchema = mongoose.Schema({
        balance: Number,
        number: Number
    }),
    adminSchema = mongoose.Schema({
        login: String,
        password: String
    }),
    logSchema = mongoose.Schema({
        type: String,
        info: Object
    }),
    user = mongoose.model('user', manSchema),
    Flat = mongoose.model('Flat', flatSchema),
    Admin = mongoose.model('Admin', adminSchema),
    Log = mongoose.model('Log', logSchema);

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
        admin: Admin,
        log: Log
    }
};


