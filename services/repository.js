const MongoClient = require('mongodb').MongoClient;
const utils = require('./utils');
const connectUrl = "mongodb+srv://admin:fxiAdmin8522@fxicluster.uh3gu.mongodb.net/";
const dbName = "voltus";
var ObjectId = require('mongodb').ObjectID;

//DUMMY CUSTOMERS --
exports.createCustomers = function () {
    console.log('creating customers')
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            return;
        }

        const dbo = db.db(dbName);
        dbo.collection("customers").findOne({}, function (err, result) {
            if (err) {
                console.error('ERROR: collection => ', err);
                return;
            }

            //if no results found, create my dummy customers
            if (!result) {

                const customers = [
                    { _id: 1, name: 'Keroche Wine', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 1, dispatchTypes: [1, 2, 3] },
                    { _id: 2, name: 'Tyson Food', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 1, dispatchTypes: [1, 2, 3] },
                    { _id: 3, name: 'Wallmart SF HQ', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 2, dispatchTypes: [1, 2, 3, 4] },
                    { _id: 4, name: 'Amazon Wareshouse', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 2, dispatchTypes: [1, 2, 3] },
                    { _id: 5, name: 'Bacon Steal Meals', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 3, dispatchTypes: [1, 2, 3] },
                    { _id: 6, name: 'Simba Jungle Food Produceee', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 3, dispatchTypes: [1, 2, 3] },
                    { _id: 7, name: 'Walmart4', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 4, dispatchTypes: [1, 2, 3] },
                    { _id: 8, name: 'Customer - no dipatch', address: 'Highway 71', phone: '+16173086055', email: 'fwangohi@gmail.com', programId: 5, dispatchTypes: [] },
                ];

                dbo.collection("customers").insertMany(customers, function (err, res) {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                    db.close();
                });

            } else {
                console.log('customers exist... NO NEED TO CREATE');
            }
        });

    });
}

//DUMMY PROGRAMS -- 
exports.createPrograms = function () {
    console.log('creating programs')
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            return;
        }

        const dbo = db.db(dbName);
        dbo.collection("programs").findOne({}, function (err, result) {
            if (err) {
                console.error('ERROR: collection => ', err);
                return;
            }

            //if no results found, create my dummy customers
            if (!result) {

                const programs = [
                    { _id: 1, name: 'Green Mountain Energy Cool Mornings' },
                    { _id: 2, name: 'PG&E Easy Nights' },
                    { _id: 3, name: 'Festus Kilowatts Saver' },
                    { _id: 4, name: 'New Power New Grid' },
                    { _id: 5, name: 'Funny Games Power Saver' },
                ];

                dbo.collection("programs").insertMany(programs, function (err, res) {
                    if (err) throw err;
                    console.log("Number of documents inserted: " + res.insertedCount);
                    db.close();
                });

            } else {
                console.log('programs exist... NO NEED TO CREATE');
            }

        });

    });
}


exports.getCustomerById = function (id, callBack) {
    custId = parseInt(id);
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            callBack([]);
        }

        const dbo = db.db(dbName);
        var query = { _id: custId };
        dbo.collection("customers").find(query).toArray(function (err, result) {
            console.log("calling get cutomer by id ", id);
            if (err) {
                console.error('Error getting customer: ', err);
                //return customer;
                callBack([]);
            } else {
                customers = result;
                console.log('getGustomer', result);
                callBack(result);
                //return customers;
            }
            db.close();
        });

    });

}

exports.getProgramCustomers = function (id, callBack) {
    let progId = parseInt(id);
    let program = undefined;
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            callBack([]);
        }

        const dbo = db.db(dbName);
        const query = { _id: progId };
        dbo.collection("programs").findOne(query, function (err, result) {

            if (err) {
                console.error('Error getting customer: ', err);
                //return customer;
                callBack(program);
            } else {
                program = result;
                if (program) {
                    const custQ = { programId: progId };
                    dbo.collection("customers").find(custQ).toArray(function (custErr, custResult) {
                        program['programCustomers'] = custResult;
                        callBack(program);
                        db.close();
                    });

                } else {
                    console.log("program not found");
                    callBack(program);
                    db.close();
                }

            }

        });

    });
}

exports.getDispatchesForCustomer = function(cid, callBack){
    let custId = parseInt(cid);
    
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            console.error('ERROR connecting:', err);
            callBack([]);
        }

        const dbo = db.db(dbName);
        const query = { customerId: custId };
        dbo.collection("dispatches").find(query).toArray(function (err, result) {

            if (err) {
                console.error('Error getting customer: ', err);
               
                callBack([]);
            } else {
                callBack(result);
                
            }

        });


    });
}

exports.createNewIncident = function (corId, incident, callBack) {
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            Logger.logError(corId, error);
            callBack(undefined);
        }
        const dbo = db.db(dbName);
        incident.createdOn = new Date().toUTCString();
        incident._id = utils.createUUID();
        dbo.collection("incidents").insertOne(incident, function (err, res) {
            if (err) {
                Logger.logError(corId, error);
                callBack(undefined);
            }

            callBack(incident);
            db.close();
        });
    });

}

exports.createDispatch = function (corId, dispatch) {
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            Logger.logError(corId, error);

        }
        const dbo = db.db(dbName);
        dispatch.createdOn = new Date().toUTCString();
        dispatch._id = utils.createUUID();
        dbo.collection("dispatches").insertOne(dispatch, function (err, res) {
            if (err) {
                Logger.logError(corId, error);
            }
            db.close();
        });
    });
}

//VERY SENSITIVE HERE...
exports.createDbLog = function (log) {
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            //NOTE : USE OTHER MEANS TO LOG DB ERRORS
            console.error('ERROR connecting:', err);
            console.error('log could not be created', log);
            return;
        }
        const dbo = db.db(dbName);
        
        dbo.collection("logs").insertOne(log, function (err, res) {
            if (err) {
                //NOTE : USE OTHER MEANS TO LOG DB ERRORS
                console.error('ERROR inserting log:', err);

            }
            db.close();
        });
    });
}

exports.updateDispatchAcknowledgement = function (corId, ack, callBack) {
    MongoClient.connect(connectUrl, function (err, db) {
        if (err) {
            Logger.logError(corId, error);
            callBack(false);
        }
        const dbo = db.db(dbName);
        const query = { _id: ack._id };
        var newvalues = { $set: {hasBeenAcknowledged: true, acknowledgebBy: ack.ackBy, acknowledgeOn : ack.ackTime } };
        
        dbo.collection("dispatches").updateOne(query, newvalues, function (err, res) {
            if (err) {
                Logger.logError(corId, error);
                callBack(false);
            }
            console.log(res);

            callBack(true);
            db.close();
        });
    });

}


//ONLY FOR USE BY THE FESTUS....!!! :)
exports.purge = function (all) {
    console.log("purging transactional tables");
    MongoClient.connect(connectUrl, function (err, db) {
        const dbo = db.db(dbName);
        if (err) {
            console.log("Error connecting to DB");
            throw err;
        }

        dbo.collection("dispatches").deleteMany({}, function (err, res) {
        });

        dbo.collection("logs").deleteMany({}, function (err, res) {
        });

        dbo.collection("incidents").deleteMany({}, function (err, res) {
        });

        if (all){
            console.log("purging programs and customer tables");
            dbo.collection("programs").deleteMany({}, function (err, res) {
            });

            dbo.collection("customers").deleteMany({}, function (err, res) {
            });
        }

    })
}



