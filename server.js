var express = require('express'),
    config = require('./config'),
    http = require('http'),
    db = require('./model/db'),
    passport = require('passport');


/**
 * Process level exception catcher
 */

process.on('uncaughtException', function (err) {
  console.log("Node NOT Exiting...");
  console.log(err.stack);
});

var app = express();

db.connectDb(function(db){

    /**
     * Passport.js intiallization
     */
    require('./configrations/passport-config')(passport);
    /**
     * Express Configuration
     */
    require('./configrations/express-config')(db,app,passport);

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



