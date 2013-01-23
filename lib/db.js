var mongoose = require('mongoose'),
    dbName = require('./config').dbName;

mongoose.connect('mongodb://localhost/' + dbName);
var manSchema = mongoose.Schema({
        login: String,
        password: String,
        info: Object,
        flat: Number
    }),
    flatSchema = mongoose.Schema({
        persons: Array,
        balance: Number,
        cash: Number,
        number: Number,
        building: Number
    }),
    buildingSchema = mongoose.Schema({
        address: String,
        info: Object
    }),
    adminSchema = mongoose.Schema({
        login: String,
        password: String,
        buildings: Array
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
    dbStart : function (callback) {
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


