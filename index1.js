// import uuid4 from "uuid4";
const uuidv4 = require('uuid4');
const express = require('express');
const ws = require('ws');
const clients = new Map();

const app = express();
const port = 3064;

const wsServer = new ws.Server({ noServer: true });

const cb3 = function() {
    console.log(`client disconnected`);
}

const cb2 = function (message) {
    // wsServer.clients.forEach(function each(client) {
    //     if (client.readyState === ws.OPEN) {        
    //         var serverResponse = {
    //             source: "server", 
    //             content: `your message "${message.content}" received bhai`,
    //             timeStamp: new Date()
    //         }
    //         client.send(Buffer.from(JSON.stringify(serverResponse)), { binary: false });            
    //     }
    // });
    // console.log(message.toString());
}
const cb1 = function (webSocketClientInstance) {
    const id = uuidv4();        // Every time a client connects, we generate a new unique ID,
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(webSocketClientInstance, metadata);

    // message Event is on webSocketClientInstance & not on wsServer itself
        // but connection Event is on wsServer... wsServer can have multiple webSocketClientInstances
        // anyway, whenever the client receives a message ----> callback is triggered...
    webSocketClientInstance.on('message', message => {
        console.log('message --------> ',message);
        console.log('parsed msg -----> ',JSON.parse(message));
        const metadata = clients.get(webSocketClientInstance);
        console.log(metadata);
        // console.log(wsServer.clients);
        // console.log(metadata.sender);
        // console.log(metadata.content);
    });

    webSocketClientInstance.on('close', cb3);
}



/******************************************************************************************************** */
// connection event ----> cb1 callback gets triggered whenever a new webSocket client connects to server (testing angular app (or) postman)
//                  ----> cb1 callback gets triggered which accepts a parameter, which is nothing but webSocketClientInstance
wsServer.on('connection', cb1);
/******************************************************************************************************** */









/******************************************************************************************************** */

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server

const server = app.listen(port, () => { 
    console.log(`Example app listening at http://localhost:${port}`)
    });

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
/******************************************************************************************************** */