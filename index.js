const express = require('express');
const bodyParser = require('body-parser');

let isRunning = false;
const IDQueue = [];
const resQueue = [];

function update() {
    if(!isRunning && resQueue.length > 0) {

        const res = resQueue.shift();

        isRunning = true;

        res.send(`Started ${ IDQueue[0] }`);
        console.log(`Running: ${ IDQueue[0] }`);
    }
}

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>web sync server</h1>');
});

app.post('/', (req, res) => {

    const ID = req.body.ID;
    // TODO: handle `groupID`

    // TODO: verify ID from GitHub

    IDQueue.push(ID);
    resQueue.push(res);

    update();
});

app.delete('/', (req, res) => {

    const ID = req.body.ID;
    // TODO: handle `groupID`

    // can't dequeue from an empty queue
    if(IDQueue.length === 0) {
        return res.send('¯\\_(ツ)_/¯');
    }

    // verify ID
    if(ID !== IDQueue[0]) {
        return res.send('¯\\_(ツ)_/¯');
    }

    const topID = IDQueue.shift();

    isRunning = false;

    res.send(`Completed ${ ID }`);
    console.log(`Completed ${ topID }`);

    update();
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

console.log(`Server timeout: ${ server.timeout }`);

console.log(`Listening on port ${PORT}`);
