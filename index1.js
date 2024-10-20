const express = require('express');
const ws = require('ws');
const clients = new Map();
const app = express();
const port = 6091;

const wsServer = new ws.Server({ noServer: true });     // noServer: true
wsServer.on('connection', cb1);
const server = app.listen(port, () => { 
    console.log(`Example app listening at http://localhost:${port}`) 
});

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => { 
        console.log("evado upgrade adigaadu... so emitting connection event");
        wsServer.emit('connection', socket, request); 
    });
});

// http://localhost:6091/base23 ===> ee index1.js "http" & "ws" response rendu serve cheyyagaladu... based on "upgrade" header 
app.get('/base23', (req, res) => { res.send({ info23: 'http resp', time23: `${new Date().toISOString()}` }) })
/******************************************************************************************************** */

function cb1 (webSocketClientInstance) {
    const id = Date.now();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(webSocketClientInstance, metadata);

    // MESSAGE
    webSocketClientInstance.on('message', message => {
        console.log('message --------> ',message);
        const metadata = clients.get(webSocketClientInstance);
        console.log("meta data of client ===> ", metadata);
    });

    // CLOSE
    webSocketClientInstance.on('close', () => { console.log(`client disconnected23`); });
}
/******************************************************************************************************** */

/* 
    server is a vanilla Node.js HTTP server
    - so use the same ws upgrade process described here:

    https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server

*/

/******************************************************************************************************** */