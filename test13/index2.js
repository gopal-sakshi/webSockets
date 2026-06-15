var mongoose = require('mongoose');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));
/*************************************************************************************** */

// var server = app.listen(6092, () => { console.log('server @', server.address().port); });    // FAILS23
var server = http.listen(6092, () => { console.log('server @', server.address().port); });      // DOESNT FAIL

var io = require('socket.io')(http);
io.on('connection', (socket) =>{
    console.log('a user is connected');
    socket.emit("hello from server", 1, "2", { 3: Buffer.from([4]) });
    socket.on("hello from client", (...args) => {
        console.log('msg from client ',args);
    });
});
/*************************************************************************************** */
mongoose.connect("mongodb://localhost:27017/movies23" , (err) => { console.log('mongodb connected ',err); });
var Message = mongoose.model(`Message34`,{ name : String, message : String});


app.get('/messages', (req, res) => {    
    Message.find({},(err, messages) => { res.send(messages); });
});

app.post('/messages', (req, res) => {    
    var message = new Message(req.body);
    message.save((err) => {
        if(err) { res.sendStatus(500); } 
        else { io.emit('message', req.body); res.sendStatus(200); }
    })
});
/*************************************************************************************** */


/* 
    FAILS23 ===> 
    (a) socket.io uses http server and not the express server
    (b) you need to listen on http server but not on express like app.listen()

    01) it uses index.html file
*/

/***************************************************************************************/