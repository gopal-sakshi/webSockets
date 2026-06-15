var webSocketServer = new (require('ws')).Server({ port: 6093 });
var webSockets = {};

webSocketServer.on('connection', function (webSocket, req) {    
    console.log("req URL & ip ===> ", req.url, req.socket.remoteAddress);
    const userID = `user__${req.url.substring(1)}`;
    webSockets[userID] = webSocket;
    webSocket.id33 = `id23__${req.url}`;

    console.log('connected user23 ===> ' + userID);
    // console.log("own property names ===> ", Object.getOwnPropertyNames(webSockets));
    webSocket.on('message', function(message) { processMsg23 (message, userID) });
    webSocket.on('close', closeConn23);
});
/*************************************************************************************/


function processMsg23 (message, userID) {
    console.log('received from ===> ' + message, );
    // webSocketServer.clients  ===> is a Javascript "Set"; so cant use .map() like we do with array
    for (const client23 of webSocketServer.clients) {
        console.log("client Id ===> ", client23.id33, " ------- " ,client23.readyState)
    }    
    Object.keys(webSockets).map((item) => {     
        webSockets[item].send(`${userID} antaadu ===> ${message}`);
    });
}

function closeConn23 (param) {
    // delete webSockets[userID]
    console.log('deleted: ' + param)
}
/*************************************************************************************/

/*
    EXPLANATION

    we started a server @ port 6093
    but it uses ws protocol;
    we cant test it using CURL bcoz, curl uses http protocol
    there is "______NO http Server_____" in this index3.js file
    
    01) webSockets is an object
    keys ======> user__Benzema, user__Modric
    values ====> websocket client object --- 
        it has properties like id33, readyState, send
        if 3 clients are connected -- benz, luka, ramos ===> 3 webSocket client objects will be present
    
    
    02)
    webSocket.on('message', (message)); 
    webSocket.on('message', function(message) { processMsg23 (message, userID) });
    1st approach callback means, we cant pass userID property to processMsg23 function
    2nd approach callback means, we CAN pass userID property

*/