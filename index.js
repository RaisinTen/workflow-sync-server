const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('<h1>web sync server</h1>');
});

app.listen(5000 || process.env.PORT);
