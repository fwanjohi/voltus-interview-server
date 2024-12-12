const MongoClient = require('mongodb').MongoClient;
const utils = require('./utils');
//const connectUrl = "mongodb+srv://admin:fxiAdmin8522@fxicluster.uh3gu.mongodb.net/"; FxDispatchAdmin Fx72758515!
const uri = "mongodb+srv://FxDispatchAdmin:Fx72758515!@fxdispatchcluster.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const dbName = "admin";
var ObjectId = require('mongodb');


/**
 * DUMMY PROGRAMS --Fx72758515!
 */

function checkIfCollectionExists(db, colName) {

    const has = db.listCollections({ name: colName }).toArray().all();
    return has;
}

exports.createCustomers = function () {
    console.log('creating customers')


    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {

        client.connect();

        const dbo = client.db(dbName);
        debugger;
        //var exists = checkIfCollectionExists(dbo, "customers");
        const cols = dbo.getCollectionNames();
        console.log("ColNames : ", cols)



        //if no results found, create my dummy customers
        if (!exists) {

            const customers = [
                { _id: 1, name: 'Keroche Wine', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 1, dispatchTypes: [1, 2, 3] },
                { _id: 2, name: 'Tyson Food', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 1, dispatchTypes: [1, 2, 3] },
                { _id: 3, name: 'Wallmart SF HQ', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 2, dispatchTypes: [1, 2, 3, 4] },
                { _id: 4, name: 'Amazon Wareshouse', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 2, dispatchTypes: [1, 2, 3] },
                { _id: 5, name: 'Bacon Steal Meals', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 3, dispatchTypes: [1, 2, 3] },
                { _id: 6, name: 'Simba Jungle Food Produceee', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 3, dispatchTypes: [1, 2, 3] },
                { _id: 7, name: 'Walmart4', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 4, dispatchTypes: [1, 2, 3] },
                { _id: 8, name: 'Customer - no dipatch', address: 'Highway 71', phone: '+16173086055', email: 'fwanjohi@gmail.com', programId: 5, dispatchTypes: [] },
            ];

            dbo.collection("customers").insertMany(customers, function (err, res) {
                if (err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);

            });

        } else {
            console.log('customers exist... NO NEED TO CREATE');
        }
    }
    catch (ex) {
        console.error(ex);
    }

    finally {
        client.close();
    }




}



// 
/**
 * Internal: Creates DUMMY PROGRAMS --
 */

exports.createPrograms = function () {
    console.log('creating programs')

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        console.log('CONNECTIONG .....');
        client.connect();

        const dbo = client.db(dbName);
        console.log('CONNECTED .....');

        const progs = dbo.collection("programs").toArray();

        console.error("GETTING RESULTS");

        //if no results found, create my dummy customers

        if (progs && progs.length == 0) {
            const programs = [
                { _id: 1, name: 'Green Mountain Energy Cool Mornings' },
                { _id: 2, name: 'PG&E Easy Nights' },
                { _id: 3, name: 'Festus Kilowatts Saver' },
                { _id: 4, name: 'New Power New Grid' },
                { _id: 5, name: 'Funny Games Power Saver' },
            ];
            console.log('INSERTING .....');
            dbo.collection("programs").insertMany(programs, function (err, res) {
                if (err) throw err;
                console.log("Number of documents inserted: " + res.insertedCount);

            });

        } else {
            console.log('programs exist... no need to create');
        }

    } finally {
        client.close();
    }

}







/**
 * 
 * @param {*} id 
 * @param {*} callBack 
 */
exports.getCustomerById = function (id, callBack) {
    custId = parseInt(id);
    client.connect(connectUrl, function (err, db) {
        if (err) {
            let dbErr = utils.createDbError(err);
            console.log("a database error has happened", dbErr);
            return callBack(dbErr);
        }

        const dbo = client.db(dbName);
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
/**
 * 
 * @param {*} id 
 * @param {*} callBack 
 */
exports.getProgramCustomers = async function (id, callBack) {
    let progId = parseInt(id);
    let program = undefined;

    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });


    client.connect();

    const dbo = client.db(dbName);
    const query = { _id: progId };
    const prog = await dbo.collection("programs").findOne(query);

    if (prog) {

        const custQ = { programId: progId };
        custResult = await dbo.collection("customers").find(custQ).toArray();
        prog['programCustomers'] = custResult;
        callBack(prog);
    }

}
/**
 * 
 * @param {*} query 
 * @param {*} callBack 
 */
exports.getDispatchesForCustomer = async function (query, callBack) {


    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect();


    const dbo = client.db(dbName);

    var result = dbo.collection("dispatches").find(query);
    callBack(result)

}

/**
 * Creates a new entry in the Incidents Database
 * @param {*} corId since this is a transactional call, we need to track it in all logs
 * @param {*} incident the incident to be created
 * @param {*} callBack callback function after update
 */
exports.createNewIncident = async function (corId, incident, callBack) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect();
    const dbo = client.db(dbName);
    incident.createdOn = new Date().toUTCString();
    incident._id = utils.createUUID();
    incident.correlationId = corId;

    await dbo.collection("incidents").insertOne(incident)

    db.close();
    callBack(incident);


}
/**
 * Creates a dispatch entry in the Database
 * @param {*} corId since this is a transactional call, we need to track it in all logs
 * @param {*} dispatch the Dispatch to be created
 */
exports.createDispatch = function (corId, dispatch) {
    dispatch.hasBeenAcknowledged = false;
    client.connect(connectUrl, function (err, db) {
        if (err) {
            logger.logError(corId, error);
        }

        const dbo = client.db(dbName);
        dispatch.createdOn = new Date().toUTCString();
        dispatch._id = utils.createUUID();
        dbo.collection("dispatches").insertOne(dispatch, function (err, res) {
            if (err) {
                logger.logError(corId, error);
            }
            db.close();
        });
    });
}

/**
 * This is a very critical method. If the DB log fails, use other means to log the error (splunk, txtfiles, event logs)
 * @param {*} log the data to be logged
 */
exports.createDblog = async function (log) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect();
    const dbo = client.db(dbName);

    await dbo.collection("logs").insertOne(log);

}

/**
 * 
 * @param {*} corId since this is a transactional call, we need to track it in all logs
 * @param {*} ack status of the acknowledgement
 * @param {*} callBack callback function for the update
 */
exports.updateDispatchAcknowledgement = async function (corId, ack, callBack) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect();
    const dbo = client.db(dbName);

    const query = { _id: ack._id };
    var newvalues = { $set: { hasBeenAcknowledged: true, acknowledgebBy: ack.ackBy, acknowledgeOn: ack.ackTime } };

    dbo.collection("dispatches").updateOne(query, newvalues)

    callBack(true);
    client.close();



}


/**
 * Internal use only
 * @param {*} all the tables to purge
 */
exports.purge = async function (all) {
    console.log("purging transactional tables");
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    client.connect();
    const dbo = client.db(dbName);

        await dbo.collection("dispatches").deleteMany({});

        dbo.collection("logs").deleteMany({});

        dbo.collection("incidents").deleteMany({});

        // if (all) {
        //     console.log("purging programs and customer tables");
        //     await dbo.collection("programs").deleteMany({});
          
        //     await dbo.collection("customers").deleteMany( {});
        // }
        client.close();
   
}



