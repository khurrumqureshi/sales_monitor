var express = require('express'),
    config = require('./config'),
    http = require('http'),
    db = require('./model/db');


/**
 * Process level exception catcher
 */

process.on('uncaughtException', function (err) {
  console.log("Node NOT Exiting...");
  console.log(err.stack);
});

var app = express();

db.connectDb(function(){
    /**
     * Express Configuration
     */
    require('./configrations/express-config')(app,express);

    /**
     * Start http server here
     */
    var server = http.createServer(app);
    server.listen(config.main.port);
    console.log("Listening on " + config.main.port);
})


/**
 * Setting socket.io
 */
//var io = require('socket.io').listen(server);
//io.configure(function () {
//    io.set("transports", ["xhr-polling"]);
//    io.set("polling duration", 10);
//});
//io.sockets.on('connection', function (socket) {
//    socket.emit('news', database.news[util.getRandomInt(0,4)]);
//});
//
//setInterval(function(){
//    io.sockets.emit('news', database.news[util.getRandomInt(0,4)] )
//},10000);



