var mongoose = require('mongoose');
var dbUrl = require('./config/mongo-config');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var http = require('http').Server(app);


/* 
    This will fail ===> 
    (a) since socket.io uses http server and not the express server. 
    (b) you need to listen on http server but not on express like app.listen()
    (c) change app.listen() to server.listen()
        because express requires that you instantiate a HTTP server in Socket.IO

*/

// FAILS
// var server = app.listen(3065, () => {
//     console.log('server is running on port', server.address().port);
// });
// DOESNT FAIL
http.listen(3065, () => {
    console.log('server is running on port 3065');
})

var io = require('socket.io')(http);
io.on('connection', () =>{
    console.log('a user is connected');
})
/*************************************************************************************** */
mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected ',err);
});
var Message = mongoose.model(`Message`,{ name : String, message : String});
/*************************************************************************************** */



/*************************************************************************************** */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// to tell Express that, we will be using a static file
    // if this index.html file is in resources folder ---------------> localhost:3065 ---> Cannot Get /
    // but if this index.html file is at same place as index2.js ----> localhost:3065 ---> served the index.html file
app.use(express.static(__dirname));
/*************************************************************************************** */



/*********************** ROUTES *************************************************** */
app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
        res.send(messages);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err) { res.sendStatus(500); }
        io.emit('message', req.body);
        res.sendStatus(200);
    })
});
/*************************************************************************************** */
