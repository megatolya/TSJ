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
        number: Number,
        _building: String
    }),
    buildingSchema = mongoose.Schema({
        address: String,
        info: Object,
        _admin: String
    }),
    adminSchema = mongoose.Schema({
        login: String,
        password: String
    }),
    logSchema = mongoose.Schema({
        type: String,
        info: Object
    }),
    Person = mongoose.model('Person', manSchema),
    Flat = mongoose.model('Flat', flatSchema),
    Building = mongoose.model('Building', buildingSchema),
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
        person : Person,
        flat: Flat,
        building: Building,
        admin: Admin,
        log: Log
    }
};


