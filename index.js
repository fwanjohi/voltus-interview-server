// const express = require('express');

// const app = express();

const port = process.env.PORT || '3000';


const express = require('express');
const urlParse = require('url-parse');
const http = require('http');
//const repository = require('./services/repository');
// const dispatcher = require('./services/dispatcher');
// const utils = require('./services/utils');
// const logger = require('./services/logger');
const cors = require('cors');
const host = require('os');

const app = express();
app.use(cors());

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
//app.set('port', process.env.PORT || 3000);

const server = http.createServer(app);



app.get('/', (req, res) => {

    res.send('Mesed up again - CI deploy!!');

});

app.get('/customer', (req, res) => {

    res.send('{name: "festus-mess"}');

});

app.listen(port, () => {

    console.log(`listening at http://localhost:${port}`);

});