var db = require('./db'),
    $ = require('jquery'),
    async = require('async');

module.exports = {
    person : function (id, callback) {
        db.models.person.findById(id, function (err, man) {
            if (err) {
                callback(new Error());
                return;
            }
            db.models.flat.findById(man._flat, function (err, flat) {
                if (err) {
                    callback(new Error());
                    return;
                }
                db.models.building.findById(flat._building, function (err, building) {
                    if (err) {
                        callback(new Error());
                        return;
                    }
                    var obj = {
                        person: man,
                        flat: flat,
                        building: building
                    };
                    callback(null, obj);
                });
            });
        });
    },
    admin : function (id, callback) {
        db.models.admin.findById(id, function (err, admin) {
            if (err) {
                callback(new Error());
                return;
            }
            callback(null, {
                admin: admin
            });
        });
    },
    flat : function (id, callback) {
        db.models.flat.findById(id, function (err, flat) {
            if (err) {
                callback(new Error());
                return;
            }
            var obj = { flat: flat };
            db.models.building.findById(flat._building, function (err, building) {
                if (err) {
                    callback(new Error());
                    return;
                }
                obj.building = building;
                var tasks = [];
                db.models.person.find({_flat: id}, function (err, personsFromFlat) {
                    personsFromFlat.forEach(function (personFromFlat) {
                        tasks.push(function (callback) {
                            db.models.person.findById(personFromFlat._id, function (err, person) {
                                if (err) {
                                    callback(new Error());
                                    return;
                                }
                                callback(null, person);
                            });
                        });
                    });
                    async.parallel(tasks, function (err, persons) {
                        if (!err){
                            obj.persons = persons;
                            callback(null, obj);
                        }
                        else{
                            callback(new Error());
                        }
                    });
                });
            });
        });
    },
    building : function (id, callback) {
         db.models.building.findById(id, function (err, building) {
             var obj = { building: building };
             db.models.flat.find({_building: id}, function (err, flats) {
                 obj.flats = flats;
                 callback(null, obj);
             });
         });
    }
};