var mongoose = require('mongoose');
var dbUrl = require('./config/mongo-config');
var express = require('express');
var app = express();
var server = app.listen(3065, () => {
    console.log('server is running on port', server.address().port);
});
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', () =>{
    console.log('a user is connected');
})
/*************************************************************************************** */
// mongoose.connect(dbUrl , (err) => { 
//     console.log('mongodb connected ',err);
// })
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
    // Message.find({},(err, messages)=> {
    //   res.send(messages);
    // })
    console.log(req.body);
    res.send({"hello":"doctor"});
});

app.post('/messages', (req, res) => {
    console.log(req.body);
    res.send('waittttu');
    var message = new Message(req.body);
    message.save((err) =>{
        if(err) {
            res.sendStatus(500);
        }        
        io.emit('message', req.body);
        res.sendStatus(200);
    })
});
/*************************************************************************************** */
