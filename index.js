const express = require('express');
const bodyParser = require('body-parser');
const util = require('util');

let runningID = null;
const IDQueue = [];
const IDPool = new Set();

function printLocals() {
    // for debugging
    console.log(`runningID: ${ runningID }`);
    console.log(`IDQueue: ${ util.inspect(IDQueue) }`);
    console.log(`IDPool: ${ util.inspect(IDPool) }`);
}

function update() {

    if(runningID !== null) {
        // a workflow is already running
        console.log('A workflow is already running');
        return;
    }

    if(IDQueue.length === 0) {
        // no more IDs in queue
        console.log('No more IDs in queue');
        return;
    }

    // assign the next ID to run to
    // runningID and delete from IDPool
    runningID = IDQueue.shift();
    IDPool.delete(runningID);
}

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1>web sync server</h1>');
});

app.post('/', (req, res) => {

    const ID = req.body.ID;
    // TODO: handle `groupID`
    // TODO: secret key

    console.log(`POST ID: ${ ID }`);

    console.log('BEFORE POST:');
    printLocals();

    // TODO: verify ID from GitHub

    // insert ID if it does not already exist
    if(!IDPool.has(ID) && ID !== runningID) {
        IDQueue.push(ID);
        IDPool.add(ID);
    }

    // log status of ID
    if(ID === runningID) {
        console.log(`Running ID: ${ID}`);
        res.send(`Running ID: ${ID}`);
    } else {
        console.log(`Waiting ID: ${ID}`);
        res.send(`Waiting ID: ${ID}`);
    }

    update();

    console.log('AFTER POST:');
    printLocals();
    console.log();
});

app.delete('/', (req, res) => {

    const ID = req.body.ID;
    // TODO: handle `groupID`

    console.log(`DELETE ID: ${ ID }`);
    printLocals();

    // set runningID to null for
    // deletion in update and log
    // status of ID
    if(ID === runningID) {
        runningID = null;
        console.log(`Completed ID: ${ ID }`);
        res.send(`Completed ID: ${ ID }`);
    } else {
        console.log(`Invalid ID: ${ ID }`);
        res.send(`Invalid ID: ${ ID }`);
    }

    update();

    console.log('AFTER DELETE:');
    printLocals();
    console.log();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);

console.log(`Listening on port ${PORT}`);
