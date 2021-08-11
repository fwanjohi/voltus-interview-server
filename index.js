const express = require('express');

const app = express();

const port = process.env.PORT || '3000';

app.get('/', (req, res) => {

    res.send('Your FESTUS crazy Express API is up and running!');

});

app.listen(port, () => {

    console.log(`listening at http://localhost:${port}`);

});