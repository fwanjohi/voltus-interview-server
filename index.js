// const express = require('express');

// const app = express();

const port = process.env.PORT || '3000';


const express = require('express');
const urlParse = require('url-parse');
const http = require('http');
const repository = require('./services/repository');
const dispatcher = require('./services/dispatcher');
const utils = require('./services/utils');
const logger = require('./services/logger');
const cors = require('cors');
const host = require('os');
const path = require('path');
const { config } = require('dotenv');

const app = express();
app.use(cors());

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
app.use(express.static('public'));
// app.set("views", path.join(__dirname))
// app.set("view engine", "ejs")

const server = http.createServer(app);
//const io = require('socket.io')(server);
const io = require('socket.io')(server, {
    cors: {
        //origins: ['http://localhost:4200', '*']
        origins: ['*', 'http://localhost:4200'],
        transports: ['websocket']
    },
});

var globalSocket;

// app.param('name', function (req, res, next, name) {
//     const modified = name.toUpperCase();

//     req.name = modified;
//     next();
// });

app.get('/', (req, res) => {
    const config = getServerConfig()

    let msg = 'Fx-Voltus Dispather Server Running OK...at ' + config.ip + ':' + config.port;
    console.log(msg);
    res.send(msg);

});
// get Server API Config
app.get('/config', (req, res) => {
    const results = getServerConfig();
    res.send(results);

});

//get a specific customer
app.get('/customer/:id', (req, res) => {

    console.log("params=>", req.params);
    var custId = req.params.id;

    repository.getCustomerById(custId, (val) => {
        console.log("=================", val);
        res.send(val);
    });

});

//gets all a program and all its customers
app.get('/program/:id/customer', (req, res) => {

    var params = req.params;

    if (!params || !params.id) {
        res.status(400).end();
    }

    repository.getProgramCustomers(params.id, (val) => {
        //console.log("programCustomers", val);
        res.send(val);
    });

});

//gets all dispatches for a customer
app.get('/dispatch/customer/:id', (req, res) => {

    var params = req.params;
    if (!params || !params.id) {
        res.status(400).end();
    }

    let custId = parseInt(params.id);
    let query = { customerId: custId };

    repository.getDispatchesForCustomer(query, (val) => {
        //console.log("programCustomers", val);
        res.send(val);
    });

});

//gets all dispatch that involve a customer
//:id - customer Id
//ack - acknowledged or not
app.get('/dispatch/customer/:id/:ack', (req, res) => {

    var params = req.params;
    var hasAck = (params.ack.toLowerCase() === 'true' || params.ack.toLowerCase() === 'false');

    if (!params.id || !hasAck) {
        var resp = utils.createResponse(400, "INVALID PARAMETERS")
        res.status(resp.status).end(resp.message);
    }

    let custId = parseInt(params.id);

    let query = { customerId: custId, hasBeenAcknowledged: (params.ack.toLowerCase() === 'true') };

    repository.getDispatchesForCustomer(query, (val) => {
        //console.log("programCustomers", val);
        res.status(200).end(val);
    });

});


//Creates an incident for a program
app.post('/incident', (req, res) => {

    var incident = req.body;

    let correlationId = utils.createUUID();

    repository.createNewIncident(correlationId, incident, (val) => {
        console.log("incident created", val);
        dispatcher.dispatchIncident(correlationId, val);
        res.send(val);

        //to all other clients
        globalSocket.broadcast.emit('new-dispatch', ack);

        // to sender
        globalSocket.emit('new-dispatch', ack);
    });
});

// For Personal Use.... 
app.delete('/purge', (req, res) => {
    var q = urlParse(req.url, true).query;
    let all = (q && q.all && q.all == 1);
    repository.purge(all);
    res.end();
});


server.listen(port, () => {

    console.log(`listening at http://localhost:${port}`);
    console.log("calling repository");
    repository.createPrograms();
    repository.createCustomers();

});


//WebSocket Hookup for direct connection
io.on('connection', (socket) => {

    const corId = utils.createUUID();
    console.log('a user connected: ' + corId, socket.id);
    globalSocket = socket;
    let log = {
        datalogType: "connect",
        id: socket.id,
        //data: socket,
        success: true
    }


    logger.logItem(log);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('handshake', (userId) => {
        console.log('User : ' + userId + 'says hello');
    });

    socket.on('acknowledge', (ack) => {
        console.log('Acknlowledgement Received', ack);
        let corId = utils.createUUID();
        repository.updateDispatchAcknowledgement(corId, ack, (success) => {

            let log = {
                datalogType: "dispatch-ack",
                id: ack._id,
                data: ack,
                success: success
            }

            ack["success"] = success;
            logger.logAudit(corId, log);

            //to all other clients
            socket.broadcast.emit('acknowledge-update', ack);

            // to sender
            socket.emit('acknowledge-update', ack);
        });
    });
})

function sendResponse(res, data) {
    res.status(data.statusCode).end(data.message);
}

function getServerConfig() {
    const { networkInterfaces } = require('os');

    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {

                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);

                if (name == "vEthernet (WSL)" || name == "eth0") {
                    results['ip'] = net.address;
                }


            }
        }
    }
    results["port"] = port;
    return results;

}


app.get('/test', (req, res) => {

});
