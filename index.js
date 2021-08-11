const express = require('express');

const app = express();

const port = process.env.PORT || '3000';

app.get('/', (req, res) => {

    res.send('Mesed up again!!');

});

app.get('/customer', (req, res) => {

    res.send('{name: "festus-mess"}');

});





app.listen(port, () => {

    console.log(`listening at http://localhost:${port}`);

});