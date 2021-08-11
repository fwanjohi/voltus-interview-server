const express = require('express');

const app = express();

const port = process.env.PORT || '3000';

app.get('/', (req, res) => {

    res.send('Your Express API is up and running!');

});

app.get('/customer', (req, res) => {

    res.send('{name: "festus"}');

});





app.listen(port, () => {

    console.log(`listening at http://localhost:${port}`);

});